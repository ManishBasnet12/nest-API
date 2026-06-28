"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../services/product.service";
import ProductCard from "./productCard";
import { ProductCardSkeleton } from "../ui/Skeletons";
import { Product } from "../../types/product";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

interface ProductListProps {
  title: string;
  categoryId: number;
}

export default function ProductList({ title, categoryId }: ProductListProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
  });

  const { data: products, isLoading } = useQuery<Product[], Error>({
    queryKey: ["products", "category", categoryId],
    queryFn: async () => {
      const data = await getProducts(categoryId);
      return Array.isArray(data) ? data : data?.data || [];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  if (!isLoading && (!products || products.length === 0)) return null;

  return (
    <section className="bg-white py-6 ">
      <div className="mx-auto max-w-350 px-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-gray-900 md:text-xl">
            {title}
          </h2>
          <Link
            href={`/categories/${categoryId}`}
            className="text-sm font-bold text-green-600 hover:underline"
          >
            See All
          </Link>
        </div>

        <div className="relative">
          <button
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md text-gray-700 transition-all hover:bg-gray-50 hover:scale-105 active:scale-95"
            aria-label="Slide left"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md text-gray-700 transition-all hover:bg-gray-50 hover:scale-105 active:scale-95"
            aria-label="Slide right"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>

          <div
            className="overflow-hidden cursor-grab active:cursor-grabbing"
            ref={emblaRef}
          >
            <div className="flex gap-10 pb-2 pt-1">
              {isLoading
                ? Array(6)
                    .fill(0)
                    .map((_, i) => <ProductCardSkeleton key={i} />)
                : products?.map((product) => (
                    <div key={product.id} className="shrink-0">
                      <ProductCard product={product} />
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
