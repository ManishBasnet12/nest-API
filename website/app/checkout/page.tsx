"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "../../hooks/useCartStore"; // adjust path
import { getUser, getToken } from "../../services/auth.service"; // adjust path
import { createOrder } from "../../services/order.service";
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck } from "lucide-react";

export default function OrderPage() {
  const router = useRouter();
  const { items, totalPrice, totalItems } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const [address, setAddress] = useState({
    fullName: "",
    phoneNumber: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
  });

  useEffect(() => {
    setMounted(true);
    const token = getToken();
    const user = getUser();

    if (!token || !user || items.length === 0) {
      router.push("/");
    }
  }, [items, router]);

  const calculations = useMemo(() => {
    const subtotal = typeof totalPrice === "function" ? totalPrice() : 0;
    const count = typeof totalItems === "function" ? totalItems() : items.length;
    const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 99;
    const total = subtotal + shipping;

    return { subtotal, count, shipping, total };
  }, [items, totalPrice, totalItems]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setOrderError(null);

    try {
      await createOrder({
        fullName: address.fullName,
        phoneNumber: address.phoneNumber,
        streetAddress: address.streetAddress,
        city: address.city,
        stateRegion: address.state, // form field is "state", DTO expects "stateRegion"
        postalCode: address.postalCode,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      });
 await useCartStore.getState().clearCart();
    setOrderSuccess(true);
      setOrderSuccess(true);
    } catch (error) {
      console.error("Order submission failed:", error);
      setOrderError(
        error instanceof Error ? error.message : "Failed to place order"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (orderSuccess) {
    return (
      <main className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={36} />
        </div>
        <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">
          Order Placed Successfully!
        </h1>
        <p className="text-sm text-stone-500 mt-2 max-w-sm">
          Thank you for your purchase! Your package will be prepared and
          delivered to your designated location shortly.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-full bg-stone-900 px-6 py-3 text-[13px] font-medium text-white hover:bg-stone-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 py-10">
      <div className="mx-auto max-w-5xl px-4">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-800 mb-6 transition-colors duration-150"
        >
          <ArrowLeft size={14} /> Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          <form
            onSubmit={handleSubmitOrder}
            className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-stone-100 flex flex-col gap-4"
          >
            <div>
              <h2 className="text-lg font-semibold text-stone-900">
                Delivery Location
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Please specify where you would like your package delivered.
              </p>
            </div>

            {orderError && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {orderError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-stone-500">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  name="fullName"
                  value={address.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full border text-black border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-stone-500">
                  Phone Number
                </label>
                <input
                  required
                  type="tel"
                  name="phoneNumber"
                  value={address.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  className="w-full border text-black border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-stone-500">
                Street Address
              </label>
              <input
                required
                type="text"
                name="streetAddress"
                value={address.streetAddress}
                onChange={handleInputChange}
                placeholder="House No, Apartment, Street Name"
                className="w-full border text-black border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-stone-500">
                  City
                </label>
                <input
                  required
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleInputChange}
                  placeholder="Mumbai"
                  className="w-full border text-black border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-stone-500">
                  State / Region
                </label>
                <input
                  required
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleInputChange}
                  placeholder="Maharashtra"
                  className="w-full border text-black border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5">
                <label className="text-xs font-medium text-stone-500">
                  Postal Code
                </label>
                <input
                  required
                  type="text"
                  name="postalCode"
                  value={address.postalCode}
                  onChange={handleInputChange}
                  placeholder="400001"
                  className="w-full border text-black border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full text-center bg-amber-500 text-white py-3.5 rounded-full text-sm font-semibold hover:bg-amber-400 disabled:bg-stone-300 transition-colors shadow-sm"
            >
              {isSubmitting ? "Processing Order..." : "Confirm & Place Order"}
            </button>
          </form>

          <div className="bg-stone-950 text-white p-6 rounded-2xl shadow-xl lg:sticky lg:top-6 flex flex-col max-h-[85vh]">
            <h3 className="font-semibold text-base tracking-wide border-b border-white/10 pb-3">
              Order Summary
            </h3>

            <div className="flex-1 overflow-y-auto my-4 pr-1 divide-y divide-white/5 scrollbar-thin">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-stone-800">
                    <Image
                      src={item.product.image || "/dummy.png"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-white/90">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] text-white/50 mt-0.5">
                      Qty: {item.quantity} × ₹{item.product.price.toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-white/90 whitespace-nowrap pl-2">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 flex flex-col gap-2.5 text-xs text-white/60">
              <div className="flex justify-between">
                <span>Items Subtotal ({calculations.count})</span>
                <span className="text-white">
                  ₹{calculations.subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Shipping Delivery</span>
                {calculations.shipping === 0 ? (
                  <span className="text-emerald-400 font-medium">Free</span>
                ) : (
                  <span className="text-white">₹{calculations.shipping}</span>
                )}
              </div>

              <div className="flex justify-between font-semibold text-sm text-white pt-3 border-t border-white/10 mt-1">
                <span>Total Amount</span>
                <span className="text-amber-400 text-base">
                  ₹{calculations.total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 flex gap-4 items-center text-[10px] text-white/30">
              <div className="flex items-center gap-1">
                <ShieldCheck size={12} className="text-white/40" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-1">
                <Truck size={12} className="text-white/40" />
                <span>Verified Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}