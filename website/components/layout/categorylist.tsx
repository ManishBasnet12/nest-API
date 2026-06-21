"use client";

import Image from "next/image";
import Link from "next/link";
import { useCategories } from "../../hooks/useCategories";
import { CategorySkeleton } from "../ui/Skeletons";
import { Category } from "../../types/category";

const FALLBACK_IMAGE = "/dummy.png";

export default function CategoryList() {
  const { data: categories, isLoading } = useCategories();

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-6">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-[15px] font-medium text-black">Shop by category</h2>
        <Link
          href="/categories"
          className="text-[12px] text-gray-400 transition-colors hover:text-black"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-6 md:grid-cols-10">
        {isLoading
          ? Array(20)
              .fill(0)
              .map((_, i) => <CategorySkeleton key={`skeleton-${i}`} />)
          : categories?.map((cat) => <CategoryCard key={cat.id} cat={cat} />)}
      </div>
    </section>
  );
}

function CategoryCard({ cat }: { cat: Category }) {
  return (
    <Link
      href={`/categories/${cat.id}`}
      className="group flex flex-col items-center gap-2"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-50 transition-all duration-200 group-hover:border-gray-300 group-hover:bg-gray-100">
        <Image
          src={cat.imageUrl || FALLBACK_IMAGE}
          alt={cat.name}
          fill
          sizes="(max-width: 768px) 80px, 140px"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
      </div>

      <span className="line-clamp-2 text-center text-[11px] font-medium leading-tight text-gray-500 transition-colors group-hover:text-black md:text-[12px]">
        {cat.name}
      </span>
    </Link>
  );
}