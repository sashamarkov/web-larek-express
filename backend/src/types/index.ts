export interface IProduct {
  _id: string;
  title: string;
  price: number | null;
  description: string;
  category: string;
  image: {
    fileName: string;
    originalName: string;
  };
}

export interface IOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number;
}
