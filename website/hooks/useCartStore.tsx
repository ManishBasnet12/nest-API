// website/src/store/useCartStore.ts
import { create } from "zustand";
import {
  getBackendCart,
  addToBackendCart,
  removeFromBackendCart,
  clearBackendCart,
} from "../services/cart.service";

export interface BackendCartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image?: string;
    mrp?: number;
  };
}

interface CartState {
  items: BackendCartItem[];
  totalAmount: number;
  itemCount: number;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalPrice: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalAmount: 0,
  itemCount: 0,

  fetchCart: async () => {
    try {
      const data = await getBackendCart();

      const { items, totalAmount, itemCount } = data || {
        items: [],
        totalAmount: 0,
        itemCount: 0,
      };

      set({
        items: Array.isArray(items) ? items : [],
        totalAmount,
        itemCount,
      });
    } catch (error) {
      console.error("Error fetching database cart:", error);
    }
  },

  addItem: async (productId: number, quantity: number) => {
    try {
      await addToBackendCart(productId, quantity);
      await get().fetchCart();
    } catch (error) {
      console.error("Error updating item quantity in backend cart:", error);
    }
  },

  removeItem: async (productId: number) => {
    try {
      await removeFromBackendCart(productId);
      await get().fetchCart();
    } catch (error) {
      console.error("Error deleting item from cart table:", error);
    }
  },

  clearCart: async () => {
    try {
      await clearBackendCart();
      set({ items: [], totalAmount: 0, itemCount: 0 });
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  },

  totalPrice: () => get().totalAmount,
  totalItems: () => get().itemCount,
}));