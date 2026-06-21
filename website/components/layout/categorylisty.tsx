"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 🚀 Tracks active route automatically
import { useCategories } from "../../hooks/useCategories"; 
import { Category } from "../../types/category"; 

// ─── Real photo URLs from Pexels (Direct CDN links) ──────────────────────────
const CATEGORY_IMAGE_MAP: Record<string, string> = {
  Electronics: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  "Computers & Accessories": "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  "Smartphones & Tablets": "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  "Cameras & Photography": "https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  "Audio & Headphones": "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  "Home Appliances": "https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  "Kitchen & Dining": "https://images.pexels.com/photos/1358900/pexels-photo-1358900.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  Furniture: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  "Home Decor": "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  "Bedding & Bath": "https://images.pexels.com/photos/1034584/pexels-photo-1034584.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  "Mens Fashion": "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  "Womens Fashion": "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  "Kids & Baby": "https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  "Jewelry & Watches": "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  "Beauty & Personal Care": "https://images.pexels.com/photos/2253834/pexels-photo-2253834.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  "Health & Wellness": "https://images.pexels.com/photos/3927387/pexels-photo-3927387.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  "Sports & Outdoors": "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  "Tools & Home Improvement": "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  Automotive: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  "Toys & Games": "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
};

const FALLBACK_IMAGE = "/dummy.png";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function resolveImage(cat: { name: string; image?: string }): string {
  if (cat.image) {
    if (cat.image.startsWith("http")) return cat.image;
    const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
    return `${base}${cat.image}`;
  }
  return CATEGORY_IMAGE_MAP[cat.name] ?? FALLBACK_IMAGE;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CategorySidebar() {
  const { data: categories, isLoading } = useCategories();
  const pathname = usePathname();

  return (
    <aside className="  sticky top-0 flex h-screen w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white">
      {/* Sidebar Header */}
      <div className="flex items-baseline justify-between border-b border-gray-100 p-4">
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

      {/* 📜 Scrollable Left Sidebar Container */}
      <div className="scrollbar-none flex-1 space-y-1 overflow-y-auto p-3">
        {isLoading
          ? Array(15)
              .fill(0)
              .map((_, i) => <SidebarSkeleton key={`side-skeleton-${i}`} />)
          : categories?.map((cat) => {
              // Checks if the current URL path matches this link target
              const isActive = pathname === `/categories/${cat.id}`;
              return <CategoryRow key={cat.id} cat={cat} isActive={isActive} />;
            })}
      </div>
    </aside>
  );
}

// ─── Category Row Component ───────────────────────────────────────────────────
function CategoryRow({ cat, isActive }: { cat: Category; isActive: boolean }) {
  const imgSrc = resolveImage(cat);

  return (
    <Link
      href={`/categories/${cat.id}`}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
        isActive
          ? "bg-black text-white font-medium shadow-sm"
          : "text-gray-600 hover:bg-gray-50 hover:text-black"
      }`}
    >
      <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
        <Image
          src={cat.imageUrl ? resolveImage(cat) : FALLBACK_IMAGE}
          alt={cat.name}
          fill
          sizes="36px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
      </div>

      <span className="line-clamp-1 text-[13px]">
        {cat.name}
      </span>
    </Link>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SidebarSkeleton() {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 animate-pulse">
      <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-gray-100" />
      <div className="h-3 w-2/3 rounded bg-gray-100" />
    </div>
  );
}