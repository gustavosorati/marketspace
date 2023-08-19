import { AxiosError } from "axios";
import { IProduct } from "../../dtos/ProductsDTO";
import { api } from "../http/api";
import { ToastNotification } from "../../helpers/ToastNotification";
import { AppError } from "../../helpers/AppError";

type Product = IProduct & {
  is_active: boolean;
}

async function create(data: FormData) {
  try {
    await api.post("/users/", data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })

  } catch (error) {
    if(error instanceof AxiosError) {
      ToastNotification({
        type: "error",
        message: "Error",
        description: error.response?.data.message
      });
    }
  }
}


async function products(): Promise<Product[] | undefined>{
  try {
    const response = await api.get<Product[]>(`/users/products/`);

    return response.data;
  } catch (error) {
    if(error instanceof AxiosError) {
      const isAppError = error instanceof AppError;

      ToastNotification({
        type: "error",
        message: isAppError ? error.message : "Error",
        description: isAppError ? "" : "Tente novamente mais tarde"
      })
    }
  }
}

export const USER_SERVICES = {
  products,
  create
}
