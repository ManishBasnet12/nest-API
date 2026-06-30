import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartProduct {
  id: number;
  name: string;
  price: number;
  image?: string;
  mrp?: number;
  category?: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
  product: CartProduct;
}

interface CartState {
  items: CartItem[];
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addItem: (product: CartProduct, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,

      setHasHydrated: (state) => set({ hasHydrated: state }),

      addItem: (product, quantity) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === product.id
          );

          if (existing) {
            const newQty = existing.quantity + quantity;

            if (newQty <= 0) {
              return {
                items: state.items.filter((i) => i.productId !== product.id),
              };
            }

            return {
              items: state.items.map((i) =>
                i.productId === product.id ? { ...i, quantity: newQty } : i
              ),
            };
          }

          if (quantity <= 0) return state;

          return {
            items: [
              ...state.items,
              { productId: product.id, quantity, product },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "store-cart",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);