'use client';

import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ArticlePage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-4">Article non disponible</h1>
      <p className="text-gray-600 mb-6">Cet article n&apos;existe pas encore.</p>
      <Button asChild variant="outline">
        <Link href="/blog" className="inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour au blog
        </Link>
      </Button>
    </div>
  );
}
