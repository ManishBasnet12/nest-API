"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "../../../services/product.service";
import AddToCartButton from "../../../components/ui/AddToCartButton";
import CategorySidebar from "@/components/layout/categorylisty";

const CategoryPage = () => {
  const params = useParams();
  const id = params?.id as string;

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const loadItems = async () => {
      setLoading(true);
      try {
        const data = await getProducts(id);
        setProducts(data);
      } catch (error) {
        console.error("Error loading category items:", error);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, [id]);

  return (
    <div className="w-full bg-gray-50 flex justify-center">
      
      <div className="mx-auto max-w-[1400px] w-full flex h-screen items-start overflow-hidden bg-white text-gray-900 border-x border-gray-100">
        
        <CategorySidebar />

        <main className=" scrollbar-none h-full flex-1 overflow-y-auto px-6 py-12 sm:px-10 lg:px-16">
          <div className="max-w-5xl mx-auto">

            <div className="flex justify-between items-end mb-10 pb-5 border-b border-gray-100">
              <div>
                <h1
                  className="text-2xl text-gray-900 tracking-tight leading-snug"
                  style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: "italic", fontWeight: 400 }}
                >
                  {id?.replace(/-/g, " ")}
                </h1>
                {!loading && products.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-light">
                    {products.length} {products.length === 1 ? "item" : "items"}
                  </p>
                )}
              </div>
            </div>

            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex flex-col rounded-xl overflow-hidden border border-gray-100">
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

            {!loading && products.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
                  </svg>
                </div>
                <p className="text-[14px] font-medium text-gray-700 mb-1">Nothing here yet</p>
                <p className="text-[12px] text-gray-400 font-light leading-relaxed max-w-[220px] mb-5">
                  Check back later for new arrivals in this category.
                </p>
                <Link
                  href="/"
                  className="text-[12px] text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 hover:border-gray-400 hover:text-gray-700 transition-colors"
                >
                  Back to home
                </Link>
              </div>
            )}

            {!loading && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="group flex flex-col rounded-xl border border-gray-100 overflow-hidden bg-white hover:border-gray-200 transition-all duration-200"
                  >
                    <Link href={`/products/${item.id}`} className="relative aspect-square overflow-hidden bg-gray-50 block">
                      <Image
                        src={item.imageUrl || "/dummy.png"}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                    </Link>

                    <div className="p-4 flex flex-col flex-1 gap-1">
                      <Link href={`/products/${item.id}`}>
                        <h3 className="text-[13px] font-medium text-gray-800 truncate leading-snug hover:text-black transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-[11px] text-gray-400 font-light leading-relaxed line-clamp-2 flex-1">
                        {item.description}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <span
                          className="text-[15px] text-gray-900"
                          style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontWeight: 400 }}
                        >
                          ${item.price}
                        </span>
                        <AddToCartButton productId={Number(item.id)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;