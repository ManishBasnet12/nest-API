// website/src/services/category.service.ts
import { api } from "../lib/api-client";

export const getCategories = async () => {
    const { data } = await api.get("/category");
    return data?.data;
  }

export const getCategoryById = async (id: string) => {
  const { data } = await api.get(`/categories/${id}`);
  return data?.data;
};