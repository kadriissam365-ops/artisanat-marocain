'use client';

import { useTranslations } from 'next-intl';
import { BookOpen } from 'lucide-react';

export default function BlogPage() {
  const t = useTranslations('common');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-terracotta-700 mb-4">
          Blog
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-terracotta-500 to-sand-400 mx-auto rounded-full" />
      </div>

      <div className="text-center py-16">
        <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-lg text-gray-600 mb-2">
          Nos articles arrivent bientot !
        </p>
        <p className="text-gray-500">
          Decouvrez nos guides sur l&apos;artisanat marocain, les techniques traditionnelles et les histoires de nos artisans.
        </p>
      </div>
    </div>
  );
}
