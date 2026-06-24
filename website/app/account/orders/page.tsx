"use client";

import { useEffect, useState } from "react";
import { getMyOrders, Order } from "@/services/order.service"; // adjust path
import OrderCard from "../../../components/layout/orderitems";
import { PackageSearch, Loader2 } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchOrders() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMyOrders();
        if (active) setOrders(data);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Failed to load orders"
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    fetchOrders();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="flex-1 min-w-0 border border-gray-100 rounded-xl p-8 space-y-8">
      <div>
        <h1 className="font-display text-2xl italic text-gray-900 mb-1">
          My Orders
        </h1>
        <p className="text-sm text-gray-400 font-light">
          Track and review your past purchases
        </p>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Loader2 size={22} className="animate-spin mb-2" />
          <p className="text-sm font-light">Loading your orders...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
          <PackageSearch size={32} className="mb-3 text-gray-300" />
          <p className="text-sm font-medium text-gray-700">No orders yet</p>
          <p className="text-xs mt-1 font-light">
            Items you purchase will show up here.
          </p>
        </div>
      )}

      {!isLoading && !error && orders.length > 0 && (
        <div className="flex flex-col gap-4">
          {orders
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
        </div>
      )}
    </section>
  );
}