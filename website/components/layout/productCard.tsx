// website/src/components/shared/productCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "../ui/AddToCartButton"; // 👈 Verified relative path pointing to your cart folder

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const productImage = product.imageUrl || "/images/placeholder.jpg";

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="group relative flex w-[180px] flex-col overflow-hidden bg-white  md:w-[220px]">
      {/* Product Image Link */}
      <Link href={`/products/${product.id}`} className="relative  w-full aspect-square overflow-hidden  bg-gray-50 ">
        <Image
          src={productImage || "/dummy.png"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 180px, 220px"
          className="object-contain  transition-transform duration-300 group-hover:scale-105"
          priority={false}
        />
      </Link>

      {/* Product Info */}
      <div className="mt-3 flex flex-1 flex-col justify-between">
        <div>
          {product.category && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
              {product.category}
            </span>
          )}
          <Link href={`/products/${product.id}`}>
            <h3 className="mt-1 line-clamp-2 text-xs font-semibold text-gray-800 hover:text-green-600 md:text-sm">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900 md:text-base">
            {formatPrice(product.price)}
          </span>
          
          {/* Your updated, intercept-capable button */}
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}