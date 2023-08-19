import { AxiosError } from "axios";
import { ISession } from "../../dtos/SessionsDTO";
import { api } from "../http/api";
import { AppError } from "../../helpers/AppError";
import { ToastNotification } from "../../helpers/ToastNotification";

interface Props {
  email: string;
  password: string;
}

export async function loginService({ email, password }: Props) {
  try {
    const response = await api.post<ISession>("/sessions", {
      email,
      password
    });

    return response.data;
  } catch (error) {
    const isAppError = error instanceof AppError;

    ToastNotification({
      type: "error",
      message: isAppError ? error.message : "Error",
      description: isAppError ? "" : "Tente novamente mais tarde"
    })
  }

}
