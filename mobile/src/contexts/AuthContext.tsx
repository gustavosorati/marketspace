import jwtDecode from "jwt-decode"
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { User } from "../dtos/SessionsDTO";
import { api } from "../services/http/api";
import { TokenStorage } from "../storages/StorageToken";
import { UserStorage } from "../storages/StorageUser";
import { sub } from "react-native-reanimated";

interface AuthProviderProps {
  children: ReactNode;
}

interface IToken {
  token: string;
  refreshToken: string;
}

interface AuthContextProps {
  isLoadingTokenStorage: boolean;
  saveUserToken: (user: User, token: string, refreshToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  user: User;
  token: IToken;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>({} as User);
  const [token, setToken] = useState<IToken>({} as IToken);
  const [isLoadingTokenStorage, setIsLoadingTokenStorage] = useState(false);

  async function updateUserAndToken(user: User, token: string, refreshToken: string) {
		api.defaults.headers.common.Authorization = `Bearer ${token}`;

    setUser(user);
    setToken({ token, refreshToken });
  }

  async function saveTokenAndUser(user: User, token: string, refreshToken: string) {
    try {
      await UserStorage.saveAuthUserStorage(user);
      await TokenStorage.saveAuthTokenStorage(token, refreshToken);
    } catch (error) {
      throw error;
    }
  }

  async function storageTokenClear() {
    try {
      await UserStorage.removeAuthUserStorage();
      await TokenStorage.removeAuthTokenStorage();
    } catch (error) {
			throw error;
    }
  }

  async function saveUserToken(user: User, token: string, refreshToken: string) {
    try {
      setIsLoadingTokenStorage(true);

			if(token && refreshToken) {
				await updateUserAndToken(user, token, refreshToken);
				await saveTokenAndUser(user, token, refreshToken);
			}
		} catch (error) {
			throw error;
		} finally {
			setIsLoadingTokenStorage(false);
		}
  }

  async function storageTokenLoading() {
    try {
      const user = await UserStorage.getAuthUserStorage();
      const { token, refresh_token } = await TokenStorage.getAuthTokenStorage();

      if(user && token) await updateUserAndToken(user, token, refresh_token);
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      setIsLoadingTokenStorage(true);

      await storageTokenClear();

      setUser({} as User);
      setToken({} as IToken);
    } catch (error) {

    }
  }

  useEffect(() => {
    storageTokenLoading();
  }, []);

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut);

    return subscribe;
  }, []);

  return (
    <AuthContext.Provider value={{
      isLoadingTokenStorage,
      saveUserToken,
      signOut,
      user,
      token
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthentication() {
  const context = useContext(AuthContext);

  return context;
}
