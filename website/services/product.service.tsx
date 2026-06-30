// website/src/services/product.service.ts
import { api } from "../lib/api-client";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface SearchProductsParams {
  q: string;
  page: number;
}

export interface SearchProductsResponse {
  products: Product[];
  totalPages: number;
  totalItems: number;
}

export async function searchProducts({q,page,}: SearchProductsParams): Promise<SearchProductsResponse> {
  const { data: payload } = await api.get("/product/search", {
    params: { q: q.trim(), page },
  });

  return {
    products: payload?.data || [],
    totalPages: payload?.meta?.lastPage || 1,
    totalItems: payload?.meta?.total || 0,
  };
}

export const getProducts = async (categoryId?: string | number) => {
  const { data } = await api.get("/product", { params: { categoryId } });
  return data?.data || [];
};

export const getProductById = async (id: string) => {
  const { data } = await api.get(`/product/${id}`);
  return data;
};

export const getAllProducts = async () => {
  const { data } = await api.get("/product");
  return data?.data || [];
}
