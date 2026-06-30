"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  searchProducts,
  getProducts,
  Product,
} from "../../services/product.service";
import AddToCartButton from "../../components/ui/AddToCartButton";
import Link from "next/link";
import { View } from "lucide-react";
import ViewCartBar from "@/components/layout/cartbar";

function SearchContent() {
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const queryRef = useRef(currentQuery);

  useEffect(() => {
    queryRef.current = currentQuery;
    setProducts([]);
    setPage(1);
    setHasMore(false);
    setError(null);

    async function initialLoad() {
      setIsLoading(true);
      try {
        if (currentQuery.trim() === "") {
          const rawProducts = await getProducts();
          setProducts(rawProducts);
          setHasMore(true);
        } else {
          const data = await searchProducts({ q: currentQuery, page: 1 });
          setProducts(data.products);
          setHasMore(data.totalPages > 1);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    }

    initialLoad();
  }, [currentQuery]);

  const loadMore = useCallback(async () => {
    if (isFetchingMore || !hasMore) return;
    const nextPage = page + 1;

    setIsFetchingMore(true);
    try {
      const data = await searchProducts({
        q: queryRef.current,
        page: nextPage,
      });
      setProducts((prev) => [...prev, ...data.products]);
      setPage(nextPage);
      setHasMore(nextPage < data.totalPages);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load more products",
      );
    } finally {
      setIsFetchingMore(false);
    }
  }, [isFetchingMore, hasMore, page]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-12 sm:px-10 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-10 pb-5 border-b border-gray-100">
          <div>
            <h1
              className="text-2xl text-gray-900 tracking-tight leading-snug"
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              {currentQuery ? `Results for "${currentQuery}"` : "All Products"}
            </h1>
            {products.length > 0 && !isLoading && (
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-light">
                {products.length} products loaded
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="text-center text-red-400 py-12 text-sm font-light">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col rounded-xl overflow-hidden border border-gray-100"
              >
                <div className="aspect-square bg-gray-100 animate-pulse" />
                <div className="p-4 space-y-2.5">
                  <div className="h-3 bg-gray-100 rounded-full animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-full animate-pulse w-full" />
                  <div className="h-3 bg-gray-100 rounded-full animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <Link
                href={`/products/${product.id}`}
                key={product.id}
                className="group"
              >
                <div className="group flex flex-col border border-gray-100 overflow-hidden bg-white hover:border-gray-200 transition-all duration-200">
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={product.imageUrl || "/dummy.png"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="p-4 flex flex-col flex-1 gap-1">
                    <h3 className="text-[13px] font-medium text-gray-800 truncate leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-light leading-relaxed line-clamp-2 flex-1">
                      {product.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <span
                        className="text-[15px] text-gray-900"
                        style={{
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontWeight: 400,
                        }}
                      >
                        ${product.price}
                      </span>
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <AddToCartButton
                          product={{
                            id: Number(product.id),
                            name: product.name,
                            price: product.price,
                            image: product.imageUrl,
                          }}
                        />{" "}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && products.length === 0 && !error && (
          <div className="text-center py-20 max-w-sm mx-auto mt-6">
            <p className="text-gray-700 font-medium text-sm">
              No results found
            </p>
            <p className="text-xs text-gray-400 font-light mt-2 leading-relaxed">
              Check your spelling or try broader keywords.
            </p>
          </div>
        )}

        <div ref={sentinelRef} className="h-1" />

        {isFetchingMore && (
          <div className="flex justify-center py-10">
            <div className="w-5 h-5 border border-gray-300 border-t-gray-700 rounded-full animate-spin" />
          </div>
        )}

        {!hasMore && !isLoading && products.length > 0 && (
          <p className="text-center text-xs text-gray-300 uppercase tracking-widest py-10">
            End of results
          </p>
        )}
      </div>
      <ViewCartBar />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white text-gray-300 text-sm font-light tracking-widest uppercase">
          Loading…
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
