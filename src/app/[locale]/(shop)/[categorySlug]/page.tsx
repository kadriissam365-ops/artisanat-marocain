import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductGrid } from '@/components/product/ProductGrid';

interface Props {
  params: Promise<{ locale: string; categorySlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getCategory(slug: string, searchParams: Record<string, string | string[] | undefined>) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
  const params = new URLSearchParams();
  if (searchParams.sort) params.set('sort', String(searchParams.sort));
  if (searchParams.order) params.set('order', String(searchParams.order));
  if (searchParams.page) params.set('page', String(searchParams.page));

  const qs = params.toString();
  const res = await fetch(`${baseUrl}/api/categories/${slug}${qs ? `?${qs}` : ''}`, {
    next: { revalidate: 900 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, categorySlug } = await params;
  const data = await getCategory(categorySlug, {});

  if (!data?.category) {
    return { title: 'Categorie introuvable' };
  }

  const { category } = data;
  const title = category.metaTitle || `${category.name} - Artisanat Marocain Authentique`;
  const description =
    category.metaDescription ||
    category.description?.substring(0, 160) ||
    `Decouvrez notre collection de ${category.name} artisanal marocain.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'fr' ? 'fr_MA' : 'ar_MA',
      images: category.image ? [{ url: category.image, alt: category.name }] : [],
    },
    alternates: {
      canonical: `/${locale}/${categorySlug}`,
      languages: {
        fr: `/fr/${categorySlug}`,
        ar: `/ar/${categorySlug}`,
      },
    },
    robots: { index: true, follow: true },
  };
}

const sortOptions = [
  { label: 'Plus recents', sort: 'createdAt', order: 'desc' },
  { label: 'Prix croissant', sort: 'price', order: 'asc' },
  { label: 'Prix decroissant', sort: 'price', order: 'desc' },
  { label: 'A-Z', sort: 'name', order: 'asc' },
];

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale, categorySlug } = await params;
  const query = await searchParams;

  setRequestLocale(locale);

  const data = await getCategory(categorySlug, query);

  if (!data?.category) {
    notFound();
  }

  const { category, products, pagination } = data;
  const currentSort = String(query.sort || 'createdAt');
  const currentOrder = String(query.order || 'desc');

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        className="mb-6"
        items={[
          { label: 'Accueil', href: `/${locale}` },
          { label: 'Boutique', href: `/${locale}/boutique` },
          { label: category.name },
        ]}
      />

      {/* Category header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-3">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-muted-foreground max-w-2xl mb-4">
            {category.description}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          {pagination.total} produit{pagination.total > 1 ? 's' : ''}
        </p>
      </div>

      {/* Sub-categories */}
      {category.children && category.children.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {category.children.map((child: { id: string; name: string; slug: string; _count: { products: number } }) => (
            <Link
              key={child.id}
              href={`/${locale}/${child.slug}`}
              className="px-4 py-2 text-sm rounded-full border border-sand-200 hover:border-terracotta-300 hover:bg-terracotta-50 text-foreground transition-colors"
            >
              {child.name} ({child._count.products})
            </Link>
          ))}
        </div>
      )}

      {/* Sort bar */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground mr-1">Trier par :</span>
          {sortOptions.map((opt) => {
            const isActive = currentSort === opt.sort && currentOrder === opt.order;
            return (
              <Link
                key={`${opt.sort}-${opt.order}`}
                href={`/${locale}/${categorySlug}?sort=${opt.sort}&order=${opt.order}`}
                className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                  isActive
                    ? 'bg-terracotta-500 text-white'
                    : 'bg-sand-50 text-muted-foreground hover:bg-sand-100'
                }`}
              >
                {opt.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Products grid */}
      <ProductGrid products={products || []} locale={locale} />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {pagination.page > 1 && (
            <Link
              href={`/${locale}/${categorySlug}?page=${pagination.page - 1}${query.sort ? `&sort=${query.sort}` : ''}${query.order ? `&order=${query.order}` : ''}`}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-muted text-muted-foreground hover:bg-terracotta-100 transition-colors"
            >
              Precedent
            </Link>
          )}

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={`/${locale}/${categorySlug}?page=${page}${query.sort ? `&sort=${query.sort}` : ''}${query.order ? `&order=${query.order}` : ''}`}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                page === pagination.page
                  ? 'bg-terracotta-500 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-terracotta-100'
              }`}
            >
              {page}
            </Link>
          ))}

          {pagination.page < pagination.totalPages && (
            <Link
              href={`/${locale}/${categorySlug}?page=${pagination.page + 1}${query.sort ? `&sort=${query.sort}` : ''}${query.order ? `&order=${query.order}` : ''}`}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-muted text-muted-foreground hover:bg-terracotta-100 transition-colors"
            >
              Suivant
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
