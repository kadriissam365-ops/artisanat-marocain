'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LocalCartItem {
  productId: string;
  name: string;
  slug: string;
  categorySlug: string;
  priceMad: number;
  priceEur: number;
  quantity: number;
  stock: number;
  imageUrl: string | null;
  imageAlt: string | null;
}

interface CartState {
  items: LocalCartItem[];
  isOpen: boolean;

  addItem: (item: Omit<LocalCartItem, 'quantity'>) => { success: boolean; message: string };
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => { success: boolean; message: string };
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  getTotalItems: () => number;
  getSubtotal: (currency: 'MAD' | 'EUR') => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        if (item.stock === 0) {
          return { success: false, message: 'Produit non disponible' };
        }

        const existing = get().items.find((i) => i.productId === item.productId);

        if (existing) {
          if (existing.quantity >= item.stock) {
            return { success: false, message: 'Stock insuffisant' };
          }
          set((state) => ({
            items: state.items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          }));
          return { success: true, message: 'Quantite mise a jour' };
        }

        set((state) => ({
          items: [...state.items, { ...item, quantity: 1 }],
        }));
        return { success: true, message: 'Produit ajoute au panier' };
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return { success: true, message: 'Produit retire du panier' };
        }

        const item = get().items.find((i) => i.productId === productId);
        if (!item) {
          return { success: false, message: 'Produit non trouve' };
        }

        if (quantity > item.stock) {
          return { success: false, message: 'Stock insuffisant' };
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }));
        return { success: true, message: 'Quantite mise a jour' };
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: (currency: 'MAD' | 'EUR') => {
        return get().items.reduce((sum, item) => {
          const price = currency === 'MAD' ? item.priceMad : item.priceEur;
          return sum + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'artisanat-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
