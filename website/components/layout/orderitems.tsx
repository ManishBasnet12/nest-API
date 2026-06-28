import Image from "next/image";

type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface OrderItemType {
  id: number;
  quantity: number;
  price: number;
  product?: {
    name: string;
    image?: string;
  };
}

interface OrderType {
  id: number;
  status: string;
  totalPrice: number;
  createdAt: string;
  fullName: string;
  streetAddress: string;
  city: string;
  stateRegion: string;
  postalCode: string;
  items: OrderItemType[];
}

const statusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-600",
  PAID: "bg-blue-50 text-blue-600",
  SHIPPED: "bg-purple-50 text-purple-600",
  DELIVERED: "bg-emerald-50 text-emerald-600",
  CANCELLED: "bg-red-50 text-red-600",
};

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Processing",
  PAID: "Payment Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

export default function OrderCard({ order }: { order: OrderType }) {
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="border border-gray-100 rounded-xl p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="font-display italic text-base text-gray-900">
            Order #{order.id}
          </p>
          <p className="text-xs text-gray-400 font-light mt-0.5">
            {formattedDate}
          </p>
        </div>
        <StatusBadge status={order.status as OrderStatus} />
      </div>

      <div className="divide-y divide-gray-100">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
              <Image
                src={item.product?.image || "/dummy.png"}
                alt={item.product?.name || "Product"}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-gray-800 font-light">
                {item.product?.name}
              </p>
              <p className="text-xs text-gray-400 font-light mt-0.5">
                Qty: {item.quantity} × ₹{item.price.toLocaleString()}
              </p>
            </div>
            <span className="text-sm font-medium text-gray-900 whitespace-nowrap pl-2">
              ₹{(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-end justify-between border-t border-gray-100 pt-4">
        <div className="text-xs text-gray-400 font-light max-w-[60%]">
          <p className="font-medium text-gray-600">{order.fullName}</p>
          <p className="mt-0.5">
            {order.streetAddress}, {order.city}, {order.stateRegion} -{" "}
            {order.postalCode}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 font-light">Total</p>
          <p className="font-display italic text-lg text-gray-900">
            ₹{order.totalPrice.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}