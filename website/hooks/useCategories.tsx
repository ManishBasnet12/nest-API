// hooks/useCategories.ts
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/category.service";
import { Category } from "../types/category";

export const CATEGORIES_QUERY_KEY = ["categories"] as const;

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: getCategories, 
    staleTime: 1000 * 60 * 10, 
    gcTime: 1000 * 60 * 30,
  });
}