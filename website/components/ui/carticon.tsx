// components/shared/CartIcon.tsx
"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../../hooks/useCartStore";
import { useEffect, useState } from "react";

export default function CartIcon() {
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((state) => state.totalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center"
      aria-label="View Cart"
    >
      <ShoppingCart className="h-6 w-6 text-gray-300 transition hover:text-white" />

      {mounted && itemCount > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}