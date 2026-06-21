// app/home-client-container.tsx
"use client";

import CategoryList from "../components/layout/categorylist";
import ProductList from "../components/layout/productlist";
import { useCategories } from "../hooks/useCategories";
import { AlertCircle } from "lucide-react";

export default function HomeClientContainer() {
  const { data: categories, error } = useCategories();

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <div className="inline-flex rounded-xl bg-red-50 p-4 text-red-600 border border-red-100 items-center gap-2 text-sm font-medium">
          <AlertCircle size={16} />
          <span>Failed to map storefront sections. Please reload.</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <CategoryList />

      {categories?.map((category) => (
        <ProductList
          key={category.id}
          title={category.name}
          categoryId={category.id}
        />
      ))}
    </>
  );
}