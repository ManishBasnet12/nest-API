"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCategories } from "../../hooks/useCategories";
import { Category } from "../../types/category";

function resolveImage(cat: {
  name: string;
  image?: string;
  imageUrl?: string;
}): string {
  const imgPath = cat.imageUrl ?? cat.image;

  if (imgPath) {
    if (imgPath.startsWith("http")) return imgPath;
    const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
    return `${base}${imgPath}`;
  }
  return "";
}

export default function CategorySidebar() {
  const { data: categories, isLoading } = useCategories();
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen sm:w-64 w-[100px] flex-shrink-0 flex-col border-r border-gray-200 bg-white">
      {/* Sidebar Header */}
      <div className="sm:flex block items-baseline justify-between border-b border-gray-100 p-4">
        <h2 className="text-[14px] font-semibold tracking-wide text-black uppercase">
          Categories
        </h2>
        <Link
          href="/categories"
          className="text-[11px] text-gray-400 transition-colors hover:text-black"
        >
          View all
        </Link>
      </div>

      <div className="scrollbar-none flex-1 space-y-1 overflow-y-auto p-3">
        {isLoading
          ? Array(15)
              .fill(0)
              .map((_, i) => <SidebarSkeleton key={`side-skeleton-${i}`} />)
          : categories?.map((cat) => {
              const isActive = pathname === `/categories/${cat.id}`;
              return <CategoryRow key={cat.id} cat={cat} isActive={isActive} />;
            })}
      </div>
    </aside>
  );
}

function CategoryRow({ cat, isActive }: { cat: Category; isActive: boolean }) {
  const imgSrc = resolveImage(cat);

  return (
    <Link
      href={`/categories/${cat.id}`}
      className={`group flex sm:flex-row w-full flex-col items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 ease-in-out ${
        isActive
          ? "bg-black text-white font-medium shadow-sm"
          : "text-gray-600 hover:bg-gray-50 hover:text-black"
      }`}
    >
      {imgSrc && (
        <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
          <Image
            src={imgSrc}
            alt={cat.name}
            fill
            sizes="(max-width: 640px) 130px, 256px"
            className={`object-cover transition-transform duration-300 ${
              isActive ? "scale-110" : ""
            }`}
          />
        </div>
      )}

      <span className="line-clamp-1 text-[13px] text-center">{cat.name}</span>
    </Link>
  );
}

function SidebarSkeleton() {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 animate-pulse">
      <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-gray-100" />
      <div className="h-3 w-2/3 rounded bg-gray-100" />
    </div>
  );
}
