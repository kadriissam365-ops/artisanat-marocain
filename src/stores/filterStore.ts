'use client';

import { create } from 'zustand';
import type { ProductFilters } from '@/types';

interface FilterState {
  filters: ProductFilters;

  setFilter: <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => void;
  setFilters: (filters: Partial<ProductFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: ProductFilters = {
  category: '',
  minPrice: '',
  maxPrice: '',
  artisan: '',
  origin: '',
  sort: 'createdAt',
  order: 'desc',
  q: '',
  currency: 'MAD',
  page: 1,
};

export const useFilterStore = create<FilterState>((set) => ({
  filters: defaultFilters,

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value, page: key !== 'page' ? 1 : (value as number) },
    }));
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
  },
}));
