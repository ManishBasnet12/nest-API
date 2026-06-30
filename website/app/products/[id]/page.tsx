"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getProductById } from "../../../services/product.service";
import AddToCartButton from "@/components/ui/AddToCartButton";
import ViewCartBar from "@/components/layout/cartbar";

const ProductDetailPage = () => {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      setLoading(true);
      const data = await getProductById(id);
      setProduct(data);
      setLoading(false);
    };

    loadProduct();
  }, [id]);

  if (loading)
    return <div className="flex justify-center p-20">Loading...</div>;
  if (!product)
    return <div className="p-20 text-center">Product not found.</div>;

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left: Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 border">
          <Image
            src={product.imageUrl || "/dummy.png"}
            alt={product.name}
            fill
            priority
            className="object-contain "
          />
        </div>

        {/* Right: Details */}
        <div className="flex flex-col gap-4">
          <nav className="text-sm text-gray-500">
            Products / {product.category?.name || "General"}
          </nav>

          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          <div className="text-2xl font-semibold text-blue-600">
            ${product.price}
          </div>

          <div className="h-[1px] w-full bg-gray-200 my-2" />

          <p className="text-gray-600 leading-relaxed">
            {product.description ||
              "No description available for this product."}
          </p>

          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              mrp: product.mrp,
              category: product.category,
            }}
          />
        </div>
      </div>
      <ViewCartBar />
    </main>
  );
};

export default ProductDetailPage;
