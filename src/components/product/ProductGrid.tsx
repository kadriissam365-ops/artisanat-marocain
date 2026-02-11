'use client';

import { ProductCard } from './ProductCard';
import type { ProductListItem } from '@/types';

interface ProductGridProps {
  products: ProductListItem[];
  locale: string;
}

export function ProductGrid({ products, locale }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          Aucun produit ne correspond a vos criteres.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id || product.slug} product={product} locale={locale} />
      ))}
    </div>
  );
}
