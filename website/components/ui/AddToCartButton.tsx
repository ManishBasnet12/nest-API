"use client";

import { useCartStore } from "../../hooks/useCartStore";
import { useState } from "react";
import AuthModal from "../../auth/authmodal";
import { Plus, Minus } from "lucide-react";

export default function AddToCartButton({ productId }: { productId: number }) {
  const addItem = useCartStore((state) => state.addItem);
  const cartItem = useCartStore((state) =>
    state.items.find((item: any) => item.productId === productId),
  );

  const currentQuantity = cartItem?.quantity || 0;

  const [authOpen, setAuthOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "increment" | "decrement" | null
  >(null);

  const executeQuantityChange = async (
    targetAction: "increment" | "decrement",
  ) => {
    setIsProcessing(true);
    try {
      if (targetAction === "increment") {
        await addItem(productId, 1);
      } else if (targetAction === "decrement" && currentQuantity > 0) {
        await addItem(productId, -1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
      setPendingAction(null);
    }
  };

  const handleActionClick = (action: "increment" | "decrement") => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

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
            disabled={isProcessing}
            className="rounded border border-green-600 px-4 h-full text-xs font-bold text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
          >
            {isProcessing && pendingAction === "increment"
              ? "ADDING..."
              : "ADD"}
          </button>
        ) : (
          <div className="flex items-center border border-green-600 rounded overflow-hidden h-full bg-white">
            <button
              onClick={() => handleActionClick("decrement")}
              disabled={isProcessing}
              className="px-2 h-full flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus size={13} strokeWidth={3} />
            </button>

            <span className="px-3 text-xs font-bold text-black min-w-[24px] text-center select-none">
              {currentQuantity}
            </span>

            <button
              onClick={() => handleActionClick("increment")}
              disabled={isProcessing}
              className="px-2 h-full flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors disabled:opacity-40"
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
