'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Heart } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { useWishlistStore } from '@/stores/wishlistStore';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import type { ProductListItem } from '@/types';

export default function WishlistPage() {
  const t = useTranslations('wishlist');
  const locale = useLocale();
  const { items } = useWishlistStore();
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (items.length === 0) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    async function fetchWishlistProducts() {
      try {
        const res = await fetch('/api/products?limit=50');
        if (res.ok) {
          const data = await res.json();
          const productIds = items.map((item) => item.productId);
          const wishlistProducts = (data.products || []).filter(
            (p: ProductListItem) => productIds.includes(p.id)
          );
          setProducts(wishlistProducts);
        }
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    }

    fetchWishlistProducts();
  }, [items]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-terracotta-700 mb-4">
          {t('title')}
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-terracotta-500 to-sand-400 mx-auto rounded-full" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-xl overflow-hidden">
              <div className="h-64 bg-sand-100" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-sand-100 rounded w-3/4" />
                <div className="h-3 bg-sand-100 rounded w-1/2" />
                <div className="h-6 bg-sand-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-gray-600 mb-6">{t('empty')}</p>
          <Button asChild>
            <Link href="/boutique">Decouvrir nos produits</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
