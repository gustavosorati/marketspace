import axios, { AxiosError, AxiosInstance } from "axios";
import { Platform } from "react-native";
import { AppError } from "../../helpers/AppError";
import { TokenStorage } from "../../storages/StorageToken";

const isAndroid = Platform.OS === "android";

export const IMAGE_API =  isAndroid ? "http://192.168.100.62:3333/images/" : "http://localhost:3333/images/"

type SignOut = () => void;

type PromiseType = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
}

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
}

const api = axios.create({
  baseURL: isAndroid ? "http://192.168.100.62:3333/" : "http://localhost:3333/"
}) as APIInstanceProps;

let failedQueue: Array<PromiseType> = [];
let isRefreshing = false;

api.registerInterceptTokenManager = signOut => {
   const interceptTokenManager = api.interceptors.response.use((config) => {
    return config;
  }, async (requestError) => {
    if(requestError instanceof AxiosError) {
      if(requestError.response?.status === 401) {
        if(requestError.response.data?.message === "token.invalid"){
          const { refresh_token } = await TokenStorage.getAuthTokenStorage();

          if(!refresh_token) {
            signOut();
            return Promise.reject(requestError);
          }

          const originalRequestConfig = requestError.config;

          if(isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({
                onSuccess: (token: string) => {
                  if(originalRequestConfig?.headers){
                    originalRequestConfig.headers.Authorization = `Bearer ${token}`;
                    resolve(api(originalRequestConfig))
                  }
                },
                onFailure: (error: AxiosError) => {
                  reject(error)
                }
              });
            })
          }

          isRefreshing = true;

          return new Promise( async (resolve, reject) => {
            try {
              const { data } = await api.post("/sessions/refresh-token", {
                refresh_token
              });


              await TokenStorage.saveAuthTokenStorage(
                data.token,
                data.refresh_token
              )

              if(originalRequestConfig?.data) {
                originalRequestConfig.data = JSON.parse(originalRequestConfig.data);
              }

              originalRequestConfig.headers = { 'Authorization': `Bearer ${data.token}` };

              api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

              failedQueue.forEach(request => {
                request.onSuccess(data.token);
              });

              resolve(api(originalRequestConfig as any));
            } catch (error: any) {
              failedQueue.forEach(request => {
                request.onFailure(error);
              });

              signOut();
              reject(error);
            } finally {
              isRefreshing = false;
              failedQueue = [];
            }
          })
        }

        signOut();
      }






      if(requestError.response && requestError.response.data) {
        return Promise.reject(new AppError(
          requestError.response.data.message,
          requestError.response.status
        ));
      } else {
        return Promise.reject(requestError);
      }
    }

    return Promise.reject(requestError);
  });

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  }
}


export { api };
