import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { api } from "../lib/api-client";
import { Product, ApiResponse } from "../types/product";

export const PRODUCT_QUERY_KEY = ["products"] as const;

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await api.get<ApiResponse<Product[]>>("/products");
  return response.data.data; 
};

export function useProducts(
  options?: Partial<UseQueryOptions<Product[], Error>>,
) {
  return useQuery<Product[], Error>({
    queryKey: PRODUCT_QUERY_KEY,
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 2,
    ...options,
  });
}
