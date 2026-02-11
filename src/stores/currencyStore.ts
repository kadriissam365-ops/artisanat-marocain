'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Currency } from '@/types';

interface CurrencyState {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  toggleCurrency: () => void;
  getPrice: (priceMad: number, priceEur: number) => number;
  getSymbol: () => string;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: 'MAD',

      setCurrency: (currency: Currency) => {
        set({ currency });
      },

      toggleCurrency: () => {
        set((state) => ({
          currency: state.currency === 'MAD' ? 'EUR' : 'MAD',
        }));
      },

      getPrice: (priceMad: number, priceEur: number) => {
        return get().currency === 'MAD' ? priceMad : priceEur;
      },

      getSymbol: () => {
        return get().currency === 'MAD' ? 'MAD' : 'EUR';
      },
    }),
    {
      name: 'artisanat-currency',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
