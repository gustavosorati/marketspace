export interface IProductImage {
  id: string;
  path: string;
}

export interface IPaymentMethod {
  key: string
  name: string
}

export interface IProduct {
  id: string;
  is_new: boolean;
  name: string;
  price: number;
  accept_trade: boolean;
  product_images: IProductImage[];
  payment_methods: IPaymentMethod[];
  user: {
    avatar: string;
  };
}

export interface IProductCreated {
  id: string
  name: string
  description: string
  is_new: boolean
  price: number
  accept_trade: boolean
  user_id: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface IProductDetails {
  accept_trade: boolean
  created_at: string
  description: string
  id: string
  is_active: boolean
  is_new: boolean
  name: string
  payment_methods: IPaymentMethod[]
  price: number
  product_images: IProductImage[]
  updated_at: string
  user: {
    avatar: string;
    name: string;
    tel: string;
  }
  user_id: string
}
