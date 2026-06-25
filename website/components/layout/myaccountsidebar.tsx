"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { key: "account", label: "Account", icon: User, href: "/account" },
  {
    key: "orders",
    label: "Orders",
    icon: ShoppingBag,
    href: "/account/orders",
  },
  {
    key: "wishlist",
    label: "Wishlist",
    icon: Heart,
    href: "/account/wishlist",
  },
  {
    key: "addresses",
    label: "Saved Addresses",
    icon: MapPin,
    href: "/account/addresses",
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: Bell,
    href: "/account/notifications",
  },
  {
    key: "settings",
    label: "Settings",
    icon: Settings,
    href: "/account/settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className=" sm:block w-56 shrink-0 sticky top-24 hidden">
      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-500 hover:bg-gray-50 hover:text-black"
              }`}
            >
              <item.icon
                size={15}
                strokeWidth={1.5}
                className={`shrink-0 transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-black"
                }`}
              />
              <span className="font-light">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 pt-5 border-t border-gray-100">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors font-light">
          <LogOut size={15} strokeWidth={1.5} className="shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
