"use client";

import { useState } from "react";
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
  ChevronRight,
} from "lucide-react";


const NAV_ITEMS = [
  { key: "account",   label: "Account",        icon: User,        href: "/account" },
  { key: "orders",    label: "Orders",          icon: ShoppingBag, href: "/account/orders" },
  { key: "wishlist",  label: "Wishlist",         icon: Heart,       href: "/account/wishlist" },
  { key: "addresses", label: "Saved Addresses", icon: MapPin,      href: "/account/addresses" },
  { key: "notifications", label: "Notifications", icon: Bell,      href: "/account/notifications" },
  { key: "settings",  label: "Settings",         icon: Settings,   href: "/account/settings" },
];


function AccountOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl italic text-gray-900 mb-1">My Account</h1>
        <p className="text-sm text-gray-400 font-light">Manage your profile and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="flex items-center gap-5 p-6 border border-gray-100 rounded-xl bg-white">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
          <User size={28} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 text-base">Manish Shrestha</p>
          <p className="text-sm text-gray-400 font-light">manish@example.com</p>
        </div>
        <button className="text-xs border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors">
          Edit
        </button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Full Name",    value: "Manish Shrestha" },
          { label: "Email",        value: "manish@example.com" },
          { label: "Phone",        value: "+977 98XXXXXXXX" },
          { label: "Member Since", value: "June 2024" },
        ].map((field) => (
          <div key={field.label} className="border border-gray-100 rounded-xl p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{field.label}</p>
            <p className="text-sm text-gray-800 font-light">{field.value}</p>
          </div>
        ))}
      </div>

      <div className="border border-gray-100 rounded-xl p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-800">Password</p>
          <p className="text-xs text-gray-400 font-light mt-0.5">Last changed 3 months ago</p>
        </div>
        <button className="text-xs border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors">
          Change
        </button>
      </div>
    </div>
  );
}

function PlaceholderPanel({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl italic text-gray-900 mb-1">{title}</h1>
        <p className="text-sm text-gray-400 font-light">{description}</p>
      </div>
      <div className="border border-dashed border-gray-200 rounded-xl h-64 flex items-center justify-center text-gray-300 text-sm font-light">
        Nothing here yet
      </div>
    </div>
  );
}

const PANELS: Record<string, React.ReactNode> = {
  account:       <AccountOverview />,
  orders:        <PlaceholderPanel title="Orders"          description="Track and manage your orders" />,
  wishlist:      <PlaceholderPanel title="Wishlist"         description="Items you've saved for later" />,
  addresses:     <PlaceholderPanel title="Saved Addresses" description="Your delivery addresses" />,
  notifications: <PlaceholderPanel title="Notifications"   description="Your recent notifications" />,
  settings:      <PlaceholderPanel title="Settings"        description="App and account preferences" />,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccountPage() {
  const [active, setActive] = useState<string>("account");

  return (
    <main className="min-h-screen bg-white">
      <div
        className="mx-auto px-4 sm:px-6 py-10"
        style={{ maxWidth: "1400px" }}
      >
        <div className="flex gap-8 items-start">

          <aside className="w-56 shrink-0 sticky top-24">
            <nav className="space-y-0.5">
              {NAV_ITEMS.map(({ key, label, icon: Icon, href }) => {
                const isActive = active === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActive(key)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left
                      ${isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
                    `}
                  >
                    <Icon size={15} strokeWidth={isActive ? 2 : 1.5} className="shrink-0" />
                    <span className={isActive ? "font-medium" : "font-light"}>{label}</span>
                    {isActive && (
                      <ChevronRight size={13} className="ml-auto opacity-60" />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 pt-5 border-t border-gray-100">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors font-light">
                <LogOut size={15} strokeWidth={1.5} className="shrink-0" />
                Sign out
              </button>
            </div>
          </aside>

          <section className="flex-1 min-w-0 border border-gray-100 rounded-xl p-8">
            {PANELS[active]}
          </section>

        </div>
      </div>
    </main>
  );
}