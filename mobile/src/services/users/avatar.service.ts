import { AxiosError } from "axios";
import { api } from "../http/api";
import { ToastNotification } from "../../helpers/ToastNotification";
import { AppError } from "../../helpers/AppError";

interface Props {
  avatar: any;
  name: string;
  email: string;
  password: string;
  tel: string;
}

export async function UserAvatarService() {
  try {
    const response = await api.get("/users/me");

    return response.data;
  } catch (error) {
    if(error instanceof AxiosError) {
      const isAppError = error instanceof AppError;

      ToastNotification({
        type: "error",
        message: isAppError ? error.message : "Error",
        description: isAppError ? "" : "Tente novamente mais tarde"
      });
    }
  }
}
