import { AxiosError } from "axios";
import { api } from "../http/api";
import { ToastNotification } from "../../helpers/ToastNotification";
import { IUserInformation } from "../../dtos/UserDTO";
import { AppError } from "../../helpers/AppError";

interface Props {
  avatar: any;
  name: string;
  email: string;
  password: string;
  tel: string;
}

export async function UserInformationService(): Promise<IUserInformation | undefined> {
  try {
    const response = await api.get<IUserInformation>("/users/me");

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
