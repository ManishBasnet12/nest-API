// website/src/services/cart.service.ts
import { api } from "../lib/api-client";

export async function getBackendCart() {
  const { data } = await api.get("/cart");
  return data;
}

export async function addToBackendCart(productId: number, quantity: number) {
  const { data } = await api.post("/cart/add", {
    productId: Number(productId),
    quantity: Number(quantity),
  });
  return data;
}

export async function removeFromBackendCart(productId: number) {
  const { data } = await api.delete(`/cart/${productId}`);
  return data;
}

export async function syncBackendCart(items: { productId: number; quantity: number }[]) {
  const { data } = await api.post("/cart/sync", { items });
  return data;
}