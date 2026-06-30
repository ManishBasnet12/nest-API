// components/shared/ViewCartBar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useCartStore } from "../../hooks/useCartStore";
import { useEffect, useState } from "react";

export default function ViewCartBar() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.totalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || items.length === 0) return null;

  const previewItems = items.slice(0, 3);

  return (
    <div className="fixed bottom-5 left-1/2 z-50  w-[250px] -translate-x-1/2 sm:bottom-8">
      <Link
        href="/cart"
        className="flex items-center justify-between rounded-full bg-amber-500 px-3 py-2.5 shadow-2xl shadow-amber-900/30 transition-transform active:scale-[0.98]"
      >
        <div className="flex items-center gap-3 w-43 justify-between">
          <div className="flex -space-x-5">
            {previewItems.map((item) => (
              <div
                key={item.productId}
                className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-amber-500 bg-white"
              >
                <Image
                  src={item.product.image || "/dummy.png"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="leading-tight">
            <p className="text-[15px] font-bold text-gray-900">View cart</p>
            <p className="text-[12px] text-gray-900/70">
              {totalItems} {totalItems === 1 ? "Item" : "Items"}
            </p>
          </div>
        </div>

        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-300/60">
          <ChevronRight size={18} className="text-gray-900" strokeWidth={2.5} />
        </span>
      </Link>
    </div>
  );
}