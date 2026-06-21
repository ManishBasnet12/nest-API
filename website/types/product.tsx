export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category?: string;
  image?: string;
  mrp?: number;
  inStock: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}