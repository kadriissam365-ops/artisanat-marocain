import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ProductGrid } from '@/components/product/ProductGrid';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getProducts(searchParams: Record<string, string | string[] | undefined>) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const params = new URLSearchParams();

  if (searchParams.category) params.set('category', String(searchParams.category));
  if (searchParams.minPrice) params.set('minPrice', String(searchParams.minPrice));
  if (searchParams.maxPrice) params.set('maxPrice', String(searchParams.maxPrice));
  if (searchParams.artisan) params.set('artisan', String(searchParams.artisan));
  if (searchParams.origin) params.set('origin', String(searchParams.origin));
  if (searchParams.sort) params.set('sort', String(searchParams.sort));
  if (searchParams.order) params.set('order', String(searchParams.order));
  if (searchParams.q) params.set('q', String(searchParams.q));
  if (searchParams.page) params.set('page', String(searchParams.page));

  const res = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
    next: { revalidate: 1800 },
  });
  if (!res.ok) return { products: [], pagination: null };
  return res.json();
}

async function getCategories() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/categories`, {
    next: { revalidate: 1800 },
  });
  if (!res.ok) return { categories: [] };
  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: 'Boutique - Artisanat Marocain Authentique',
    description:
      'Parcourez notre collection complete d\'artisanat marocain : tapis berberes, poterie, bijoux, maroquinerie, zellige et bois sculpte. Livraison Maroc et Europe.',
    openGraph: {
      title: 'Boutique - Artisanat Marocain',
      description: 'Decouvrez toute notre collection d\'artisanat marocain authentique.',
      type: 'website',
      locale: locale === 'fr' ? 'fr_MA' : 'ar_MA',
    },
    alternates: {
      canonical: `/${locale}/boutique`,
      languages: {
        fr: '/fr/boutique',
        ar: '/ar/boutique',
      },
    },
    robots: { index: true, follow: true },
  };
}

export default async function BoutiquePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const query = await searchParams;

  setRequestLocale(locale);

  const [productsData, categoriesData] = await Promise.all([
    getProducts(query),
    getCategories(),
  ]);

  const { products, pagination } = productsData;
  const { categories } = categoriesData;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-2">
        Boutique
      </h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Decouvrez notre collection d&apos;artisanat marocain authentique, fabrique a la main par des maitres artisans.
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters placeholder */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-20 space-y-6">
            <div>
              <h3 className="font-medium text-foreground mb-3">Categories</h3>
              <ul className="space-y-1">
                {categories?.map((cat: { id: string; slug: string; name: string; _count?: { products: number } }) => (
                  <li key={cat.id}>
                    <a
                      href={`/${locale}/${cat.slug}`}
                      className="text-sm text-muted-foreground hover:text-terracotta-500 transition-colors flex justify-between"
                    >
                      <span>{cat.name}</span>
                      {cat._count && (
                        <span className="text-xs">({cat._count.products})</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          <ProductGrid products={products || []} locale={locale} />

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <a
                  key={page}
                  href={`/${locale}/boutique?page=${page}`}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    page === pagination.page
                      ? 'bg-terracotta-500 text-white'
                      : 'bg-muted text-muted-foreground hover:bg-terracotta-100'
                  }`}
                >
                  {page}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
