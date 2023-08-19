import { AxiosError } from "axios";
import { api } from "./http/api";
import { ToastNotification } from "../helpers/ToastNotification";
import { IProduct, IProductCreated, IProductDetails } from "../dtos/ProductsDTO";
import { AppError } from "../helpers/AppError";

interface IListProps {
  is_new?: boolean;
  accept_trade?: boolean;
  payment_methods?: string[];
  query?: string;
}

interface ICreateProps {
  name: string;
  description: string;
  is_new: boolean;
  price: number;
  accept_trade: boolean;
  payment_methods: string[];
}

interface IUpdateProps extends ICreateProps {
  productId: string;
}

async function create({ name, description, price, accept_trade, is_new, payment_methods }: ICreateProps) {
  try {
    const response = await api.post<IProductCreated>('/products', {
      name,
      description,
      price,
      accept_trade,
      is_new,
      payment_methods
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

async function update({ name, description, price, accept_trade, is_new, payment_methods, productId }: IUpdateProps) {
  try {
    await api.put(`/products/${productId}`, {
      name,
      description,
      price,
      accept_trade,
      is_new,
      payment_methods
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

async function list({ is_new, accept_trade, payment_methods, query }: IListProps): Promise<IProduct[] | undefined> {
  try {
    let paymentMethodsQuery = "";

    if(is_new)
      paymentMethodsQuery += `&is_new=${is_new}`;

    if(accept_trade)
      paymentMethodsQuery += `&accept_trade=${accept_trade}`;

    if(payment_methods) {
      paymentMethodsQuery += `&payment_methods=${JSON.stringify(payment_methods)}`;
    }

    if(query)
      paymentMethodsQuery += `&query=${query}`;

    const response = await api.get<IProduct[]>(`/products/?${paymentMethodsQuery}`);

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

async function listById(productId: string): Promise<IProductDetails | undefined> {
  try {
    const response = await api.get<IProductDetails>(`/products/${productId}`);

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

async function disable(productId: string, is_active: boolean): Promise<void> {
  try {
    await api.patch<IProductDetails>(`/products/${productId}`, {
      is_active
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

async function exclude(productId: string): Promise<void> {
  try {
    await api.delete(`/products/${productId}`);

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

export const PRODUCTS_SERVICES = {
  create,
  update,
  list,
  listById,
  exclude,
  disable,
}
