// app/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { CATEGORIES_QUERY_KEY } from "../hooks/useCategories";
import { getCategories } from "../services/category.service";
import HomeClientContainer from "./home-client-container";

export default async function Home() {
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: CATEGORIES_QUERY_KEY,
      queryFn: getCategories,
      staleTime: 1000 * 60 * 10, 
    });
  } catch (error) {
    console.error("Critical: Failed to prefetch home page configuration data:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeClientContainer />
    </HydrationBoundary>
  );
}