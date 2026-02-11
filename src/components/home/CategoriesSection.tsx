'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count: { products: number };
}

const categoryIcons: Record<string, string> = {
  'tapis-berberes': '\u{1F9F6}',
  'poterie-ceramique': '\u{1FAD9}',
  'bijoux-argent': '\u{1F48E}',
  'maroquinerie': '\u{1F45C}',
  'bois-thuya': '\u{1FAB5}',
  'textile-broderie': '\u{1F9F5}',
};

export function CategoriesSection() {
  const locale = useLocale();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setCategories(data.categories || []);
      } catch {
        // silent fail
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 w-48 bg-sand-100 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-sand-50 rounded-xl p-6 h-32" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-terracotta-700 mb-4">
            Nos Categories
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-terracotta-500 to-sand-400 mx-auto rounded-full" />
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Explorez notre selection d&apos;artisanat marocain par categorie
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${cat.slug}`}
              className="group relative bg-gradient-to-b from-sand-50 to-white border border-sand-100 rounded-xl p-6 text-center hover:shadow-lg hover:border-terracotta-200 transition-all duration-300"
            >
              <div className="text-4xl mb-3">
                {categoryIcons[cat.slug] || '\u{2666}'}
              </div>
              <h3 className="font-medium text-sm text-foreground group-hover:text-terracotta-600 transition-colors line-clamp-2">
                {cat.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {cat._count.products} produits
              </p>
              <ArrowRight className="h-3 w-3 mx-auto mt-2 text-terracotta-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
