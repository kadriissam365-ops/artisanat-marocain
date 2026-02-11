'use client';

import { useState, useEffect } from 'react';
import type { ProductListItem, ProductsResponse, FeaturedProductsResponse } from '@/types';

export function useFeaturedProducts() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch('/api/products/featured');
        if (!res.ok) throw new Error('Failed to fetch featured products');
        const data: FeaturedProductsResponse = await res.json();
        setProducts(data.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return { products, isLoading, error };
}

interface UseProductsOptions {
  category?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  q?: string;
  minPrice?: string;
  maxPrice?: string;
  artisan?: string;
  origin?: string;
  currency?: 'MAD' | 'EUR';
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (options.category) params.set('category', options.category);
        if (options.page) params.set('page', String(options.page));
        if (options.limit) params.set('limit', String(options.limit));
        if (options.sort) params.set('sort', options.sort);
        if (options.order) params.set('order', options.order);
        if (options.q) params.set('q', options.q);
        if (options.minPrice) params.set('minPrice', options.minPrice);
        if (options.maxPrice) params.set('maxPrice', options.maxPrice);
        if (options.artisan) params.set('artisan', options.artisan);
        if (options.origin) params.set('origin', options.origin);
        if (options.currency) params.set('currency', options.currency);

        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data: ProductsResponse = await res.json();
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [
    options.category,
    options.page,
    options.limit,
    options.sort,
    options.order,
    options.q,
    options.minPrice,
    options.maxPrice,
    options.artisan,
    options.origin,
    options.currency,
  ]);

  return { products, totalPages, total, isLoading, error };
}
