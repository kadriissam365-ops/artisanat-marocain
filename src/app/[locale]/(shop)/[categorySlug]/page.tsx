import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductGrid } from '@/components/product/ProductGrid';

interface Props {
  params: Promise<{ locale: string; categorySlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getCategory(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/categories/${slug}`, {
    next: { revalidate: 1800 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, categorySlug } = await params;
  const data = await getCategory(categorySlug);

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

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale, categorySlug } = await params;
  const query = await searchParams;

  setRequestLocale(locale);

  const data = await getCategory(categorySlug);

  if (!data?.category) {
    notFound();
  }

  const { category, products, pagination } = data;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        className="mb-6"
        items={[
          { label: "Accueil", href: `/${locale}` },
          { label: category.name },
        ]}
      />
      <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
        {category.name}
      </h1>
      {category.description && (
        <p className="text-muted-foreground mb-8 max-w-2xl">
          {category.description}
        </p>
      )}

      {/* TODO: FilterSidebar component */}
      <ProductGrid products={products || []} locale={locale} />

      {pagination && (
        <div className="mt-8 text-center text-muted-foreground">
          Page {pagination.page} / {pagination.totalPages} ({pagination.total} produits)
        </div>
      )}
    </div>
  );
}
