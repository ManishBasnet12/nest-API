import { api } from "../lib/api-client";

export interface CreateOrderItemPayload {
  productId: number;
  quantity: number;
  price: number;
}

export interface CreateOrderPayload {
  fullName: string;
  streetAddress: string;
  city: string;
  stateRegion: string;
  postalCode: string;
  phoneNumber: string;
  items: CreateOrderItemPayload[];
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product?: {
    id: number;
    name: string;
    image?: string;
  };
}

export interface Order {
  id: number;
  totalPrice: number;
  status: string;
  userId: number;
  items: OrderItem[];
  createdAt: string;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await api.post<Order>("/orders", payload);
  return data;
}

export async function getMyOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>("/orders");
  return data;
}

export async function getOrderById(id: number): Promise<Order> {
  const { data } = await api.get<Order>(`/orders/${id}`);
  return data;
}