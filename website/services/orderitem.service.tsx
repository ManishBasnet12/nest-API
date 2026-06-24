import { api } from "../lib/api-client";

export interface OrderItemProduct {
  id: number;
  name: string;
  imageUrl?: string;
  price?: number;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product?: OrderItemProduct;
}

export async function getOrderItemById(id: number): Promise<OrderItem> {
  const { data } = await api.get<OrderItem>(`/order-items/${id}`);
  return data;
}

export async function getOrderItemsByOrderId(
  orderId: number
): Promise<OrderItem[]> {
  const { data } = await api.get<OrderItem[]>(`/order-items/order/${orderId}`);
  return data;
}

export async function getMyOrderItems(): Promise<OrderItem[]> {
  const { data } = await api.get<OrderItem[]>("/order-items/me");
  return data;
}