import { AxiosError } from "axios";
import { ToastNotification } from "../helpers/ToastNotification";
import { api } from "./http/api";
import { AppError } from "../helpers/AppError";

interface ICreateResponse {
  id: string;
  path: string;
  product_id: string;
  created_at: string;
  updated_at: string;
}

async function create(formData: any) {
  try {
    const response = await api.post<ICreateResponse>("/products/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

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


async function update(formData: any) {
  try {
    await api.post("/products/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return true;
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

async function remove(imagesId: string[]): Promise<void> {
  try {
    await api.delete("/products/images", {
      data: {
        productImagesIds: imagesId
      }
    });

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

export const PRODUCTIMAGES_SERVICES = {
  create,
  update,
  remove
}
