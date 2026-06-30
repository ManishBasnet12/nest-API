"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
  Shield,
  RotateCcw,
  Headphones,
} from "lucide-react";
import { useCartStore } from "../../hooks/useCartStore";
import { getToken, getUser } from "../../services/auth.service";

interface StoredUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

function EmptyCart() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center gap-3 bg-stone-50 px-4 text-center">
      <div className="w-20 h-20 rounded-full border-2 border-dashed border-stone-300 flex items-center justify-center text-stone-300 mb-2">
        <ShoppingBag size={30} strokeWidth={1.4} />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-stone-800">
        Your cart is empty
      </h1>
      <p className="text-sm text-stone-400">
        Nothing here yet — let's fix that.
      </p>
      <Link
        href="/products"
        className="mt-3 inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-[13px] font-medium text-white hover:bg-stone-700 transition-colors duration-200"
      >
        Browse the collection
        <ArrowRight size={13} />
      </Link>
    </main>
  );
}

function SummaryRow({
  label,
  value,
  bold = false,
  valueClassName = "text-white/75",
}: {
  label: string;
  value: string;
  bold?: boolean;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "text-sm font-semibold text-white" : "text-sm text-white/50"}>
        {label}
      </span>
      <span className={`text-sm ${bold ? "font-semibold text-white" : ""} ${valueClassName}`}>
        {value}
      </span>
    </div>
  );
}

export default function CartPage() {
  const router = useRouter();
  const { items, addItem, removeItem, totalPrice, totalItems, hasHydrated } =
    useCartStore();

  const [user, setUser] = useState<StoredUser | null>(null);
  const [mounted, setMounted] = useState(false);
  const [coupon, setCoupon] = useState("");

  useEffect(() => {
    setMounted(true);
    const checkAuth = () => {
      const token = getToken();
      const stored = getUser();
      if (!token || !stored) {
        router.push("/");
        return;
      }
      setUser(stored);
    };
    checkAuth();
    window.addEventListener("auth_change", checkAuth);
    return () => window.removeEventListener("auth_change", checkAuth);
  }, [router]);

  if (!mounted || !user || !hasHydrated) return null;
  if (items.length === 0) return <EmptyCart />;

  const subtotal = totalPrice();
  const count = totalItems();
  const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;
  const shippingProgress = Math.min((subtotal / 1000) * 100, 100);

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-[11px] uppercase tracking-widest text-stone-400">
              Review your order
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
              Cart{" "}
              <span className="text-base font-normal text-stone-400">
                ({count} {count === 1 ? "item" : "items"})
              </span>
            </h1>
          </div>
          <Link
            href="/shop"
            className="text-sm text-stone-400 hover:text-stone-800 transition-colors duration-150"
          >
            ← Continue shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
          <div className="flex flex-col gap-4">
            <div className="hidden sm:grid sm:grid-cols-[1fr_80px_120px_90px] px-5 text-[11px] uppercase tracking-widest text-stone-400">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span className="text-right">Total</span>
            </div>

            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-stone-100 divide-y divide-stone-100 overflow-hidden">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_80px_120px_90px] items-center gap-4 px-5 py-4 hover:bg-stone-50/60 transition-colors duration-150"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-stone-100">
                      <Image
                        src={item.product.image || "/dummy.png"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-stone-800 leading-snug">
                        {item.product.name}
                      </p>
                      {item.product.category && (
                        <p className="mt-0.5 text-[11px] text-stone-400">
                          {item.product.category}
                        </p>
                      )}
                      <p className="mt-1 text-[13px] text-stone-500 sm:hidden">
                        ₹{item.product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <span className="hidden sm:block text-[13px] text-stone-500">
                    ₹{item.product.price.toLocaleString()}
                  </span>

                  <div className="flex w-fit items-center overflow-hidden rounded-full border border-stone-200 bg-white">
                    <button
                      onClick={() => {
                        if (item.quantity > 1) {
                          addItem(item.product, -1);
                        } else {
                          removeItem(item.productId);
                        }
                      }}
                      className="flex h-8 w-8 items-center justify-center text-stone-400 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-150"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} />
                    </button>

                    <span className="w-7 text-center text-[13px] font-semibold text-stone-800 select-none">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => addItem(item.product, 1)}
                      className="flex h-8 w-8 items-center justify-center text-stone-400 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-150"
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span className="text-sm font-semibold text-stone-800">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="rounded-lg p-1.5 text-stone-300 hover:bg-red-50 hover:text-red-500 transition-colors duration-150"
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {subtotal < 1000 && (
              <div className="rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-stone-100">
                <div className="mb-2.5 flex items-center justify-between text-xs text-stone-500">
                  <span>
                    Add{" "}
                    <strong className="font-semibold text-stone-800">
                      ₹{(1000 - subtotal).toLocaleString()}
                    </strong>{" "}
                    more for free shipping
                  </span>
                  <span className="font-semibold text-amber-600">
                    {Math.round(shippingProgress)}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all duration-700 ease-out"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-gray-900 p-6 text-white shadow-xl lg:sticky lg:top-6">
            <h2 className="mb-5 text-xl font-semibold tracking-tight text-white">
              Order Summary
            </h2>

            <div className="flex flex-col gap-3 mb-5">
              <SummaryRow label="Subtotal" value={`₹${subtotal.toLocaleString()}`} />
              <SummaryRow
                label="Shipping"
                value={shipping === 0 ? "Free" : `₹${shipping}`}
                valueClassName={shipping === 0 ? "text-emerald-400" : "text-white/75"}
              />
              {shipping > 0 && (
                <p className="text-[11px] text-white/30">
                  Free on orders above ₹1,000
                </p>
              )}
              <div className="border-t border-white/10 pt-3">
                <SummaryRow label="Total" value={`₹${total.toLocaleString()}`} bold />
              </div>
            </div>

            <div className="mb-4 flex gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 focus-within:border-amber-500 transition-colors duration-200">
                <Tag size={12} className="flex-shrink-0 text-white/30" />
                <input
                  type="text"
                  placeholder="Promo code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="w-full bg-transparent text-[13px] text-white placeholder-white/25 outline-none"
                />
              </div>
              <button className="rounded-xl border border-white/10 bg-white/10 px-3 text-xs font-medium text-white/70 hover:bg-white/20 transition-colors duration-150">
                Apply
              </button>
            </div>

            <Link
              href="/checkout"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 py-3.5 text-sm font-semibold text-white hover:bg-amber-400 active:scale-[.98] transition-all duration-200 mb-5"
            >
              Proceed to Pay
              <ArrowRight size={14} />
            </Link>

            <div className="flex items-center justify-between border-t border-white/10 pt-5">
              {[
                { icon: <Shield size={13} />, label: "Secure" },
                { icon: <RotateCcw size={13} />, label: "Easy returns" },
                { icon: <Headphones size={13} />, label: "24/7 support" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 text-white/30">
                  {icon}
                  <span className="text-[10px] tracking-wide">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}