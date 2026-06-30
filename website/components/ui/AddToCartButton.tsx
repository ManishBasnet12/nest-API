"use client";

import { useCartStore, CartProduct } from "../../hooks/useCartStore";
import { useState } from "react";
import AuthModal from "../../auth/authmodal";
import { Plus, Minus } from "lucide-react";
import { getToken } from "../../services/auth.service";

export default function AddToCartButton({ product }: { product: CartProduct }) {
  const addItem = useCartStore((state) => state.addItem);
  const cartItem = useCartStore((state) =>
    state.items.find((item) => item.productId === product.id),
  );

  const currentQuantity = cartItem?.quantity || 0;

  const [authOpen, setAuthOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"increment" | "decrement" | null>(null);

  const executeQuantityChange = (action: "increment" | "decrement") => {
    if (action === "increment") {
      addItem(product, 1);
    } else if (action === "decrement" && currentQuantity > 0) {
      addItem(product, -1);
    }
    setPendingAction(null);
  };

  const handleActionClick = (action: "increment" | "decrement") => {
    const token = getToken();

    if (!token) {
      setPendingAction(action);
      setAuthOpen(true);
      return;
    }

    executeQuantityChange(action);
  };

  return (
    <>
      <div className="inline-flex items-center h-8">
        {currentQuantity === 0 ? (
          <button
            onClick={() => handleActionClick("increment")}
            className="rounded border border-green-600 px-4 h-full text-xs font-bold text-green-600 hover:bg-green-50 transition-colors"
          >
            ADD
          </button>
        ) : (
          <div className="flex items-center border border-green-600 rounded overflow-hidden h-full bg-white">
            <button
              onClick={() => handleActionClick("decrement")}
              className="px-2 h-full flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={13} strokeWidth={3} />
            </button>

            <span className="px-3 text-xs font-bold text-black min-w-[24px] text-center select-none">
              {currentQuantity}
            </span>

            <button
              onClick={() => handleActionClick("increment")}
              className="px-2 h-full flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={13} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>

      <AuthModal
        isOpen={authOpen}
        onClose={() => {
          setAuthOpen(false);
          setPendingAction(null);
        }}
        onLoginSuccess={() => {
          if (pendingAction) {
            executeQuantityChange(pendingAction);
          }
        }}
      />
    </>
  );
}