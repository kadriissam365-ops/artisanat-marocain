'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';
import { useFeaturedProducts } from '@/hooks/useProducts';

export function FeaturedProducts() {
  const locale = useLocale();
  const { products, isLoading } = useFeaturedProducts();

  return (
    <section className="py-16 bg-sand-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-terracotta-700 mb-4">
            Produits en Vedette
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-terracotta-500 to-sand-400 mx-auto rounded-full" />
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Decouvrez nos pieces les plus populaires, selectionnees pour leur qualite exceptionnelle
          </p>
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Button variant="outline" size="lg" asChild className="border-terracotta-300 text-terracotta-700 hover:bg-terracotta-50">
            <Link href="/boutique" className="group">
              Voir toute la boutique
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:ml-0 rtl:mr-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
