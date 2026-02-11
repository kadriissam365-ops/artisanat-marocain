import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { JsonLd, productJsonLd } from '@/components/seo/JsonLd';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { ProductGrid } from '@/components/product/ProductGrid';

interface Props {
  params: Promise<{ locale: string; categorySlug: string; productSlug: string }>;
}

async function getProduct(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/products/${slug}`, {
    next: { revalidate: 1800 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, categorySlug, productSlug } = await params;
  const product = await getProduct(productSlug);

  if (!product) {
    return { title: 'Produit introuvable' };
  }

  const title =
    product.metaTitle ||
    `${product.name} | ${product.category?.name} | Artisanat Marocain`;
  const description =
    product.metaDescription ||
    product.shortDescription ||
    product.description?.substring(0, 160);
  const primaryImage = product.images?.find(
    (img: { isPrimary: boolean }) => img.isPrimary
  );

  return {
    title,
    description,
    openGraph: {
      title: product.name,
      description,
      type: 'website',
      locale: locale === 'fr' ? 'fr_MA' : 'ar_MA',
      images: primaryImage
        ? [
            {
              url: primaryImage.url,
              width: primaryImage.width || 1200,
              height: primaryImage.height || 630,
              alt: primaryImage.alt || product.name,
            },
          ]
        : [],
    },
    alternates: {
      canonical: `/${locale}/${categorySlug}/${productSlug}`,
      languages: {
        fr: `/fr/${categorySlug}/${productSlug}`,
        ar: `/ar/${categorySlug}/${productSlug}`,
      },
    },
    robots: { index: true, follow: true },
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale, categorySlug, productSlug } = await params;

  setRequestLocale(locale);

  const product = await getProduct(productSlug);

  if (!product) {
    notFound();
  }

  if (product.category?.slug !== categorySlug) {
    notFound();
  }

  const primaryImage = product.images?.find(
    (img: { isPrimary: boolean }) => img.isPrimary
  ) || product.images?.[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd data={productJsonLd(product)} />
      <Breadcrumbs
        className="mb-6"
        items={[
          { label: 'Accueil', href: `/${locale}` },
          { label: product.category?.name, href: `/${locale}/${categorySlug}` },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main image */}
          {primaryImage && (
            <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt || product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
                placeholder={primaryImage.blurDataURL ? 'blur' : 'empty'}
                blurDataURL={primaryImage.blurDataURL || undefined}
              />
            </div>
          )}

          {/* Thumbnail gallery */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map(
                (image: { id: string; url: string; alt: string | null; blurDataURL?: string | null }) => (
                  <div
                    key={image.id}
                    className="aspect-square bg-muted rounded-md overflow-hidden relative"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || product.name}
                      fill
                      sizes="(max-width: 1024px) 25vw, 12.5vw"
                      className="object-cover"
                    />
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="font-heading text-3xl md:text-4xl text-foreground">
            {product.name}
          </h1>

          <p className="text-sm text-muted-foreground">
            Par <span className="text-terracotta-500 font-medium">{product.artisan}</span>
            {' '}&middot;{' '}
            <span>{product.origin}</span>
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-terracotta-600">
              {Number(product.priceMad).toFixed(2)} MAD
            </span>
            {product.compareAtPriceMad && (
              <span className="text-lg text-muted-foreground line-through">
                {Number(product.compareAtPriceMad).toFixed(2)} MAD
              </span>
            )}
            {product.compareAtPriceMad && Number(product.compareAtPriceMad) > Number(product.priceMad) && (
              <span className="text-sm font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded">
                -{Math.round(((Number(product.compareAtPriceMad) - Number(product.priceMad)) / Number(product.compareAtPriceMad)) * 100)}%
              </span>
            )}
          </div>

          {/* EUR equivalent */}
          {product.priceEur && (
            <p className="text-sm text-muted-foreground">
              ~{Number(product.priceEur).toFixed(2)} EUR
            </p>
          )}

          {/* Stock */}
          <div className="text-sm">
            {product.stock > product.lowStockThreshold ? (
              <span className="in-stock font-medium">En stock</span>
            ) : product.stock > 0 ? (
              <span className="low-stock font-medium">
                Plus que {product.stock} en stock
              </span>
            ) : (
              <span className="out-of-stock font-medium">Rupture de stock</span>
            )}
          </div>

          {/* Description */}
          {product.shortDescription && (
            <p className="text-foreground leading-relaxed">{product.shortDescription}</p>
          )}

          {/* Add to Cart */}
          <AddToCartButton product={product} />

          {/* Details */}
          <div className="border-t pt-6 space-y-3 text-sm">
            {product.sku && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference</span>
                <span className="font-mono text-xs">{product.sku}</span>
              </div>
            )}
            {product.materials && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Materiaux</span>
                <span>{product.materials}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dimensions</span>
                <span>{product.dimensions}</span>
              </div>
            )}
            {product.weight && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Poids</span>
                <span>{Number(product.weight).toFixed(1)} kg</span>
              </div>
            )}
          </div>

          {/* Full description */}
          {product.description && (
            <div className="border-t pt-6">
              <h2 className="font-heading text-xl mb-3">Description</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p>{product.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews section */}
      {product.reviews && product.reviews.length > 0 && (
        <section className="mt-16">
          <h2 className="font-heading text-2xl mb-6">
            Avis clients
            {product.aggregateRating && (
              <span className="text-lg text-muted-foreground ml-2">
                ({product.aggregateRating.ratingValue}/5 - {product.aggregateRating.reviewCount} avis)
              </span>
            )}
          </h2>
          <div className="space-y-4">
            {product.reviews.map((review: { id: string; rating: number; title: string | null; comment: string | null; createdAt: string; user: { firstName: string | null; lastName: string | null } }) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-sand-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < review.rating ? 'text-sand-500' : 'text-muted'}>
                        &#9733;
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {review.user.firstName} {review.user.lastName}
                  </span>
                </div>
                {review.title && (
                  <h4 className="font-medium text-sm">{review.title}</h4>
                )}
                {review.comment && (
                  <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="font-heading text-2xl mb-6">Produits similaires</h2>
          <ProductGrid products={product.relatedProducts} locale={locale} />
        </section>
      )}
    </div>
  );
}
