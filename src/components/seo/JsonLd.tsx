const SITE_NAME = "Artisanat Premium";
const SITE_URL = "https://artisanat-marocain.ma";

// --- Generic JSON-LD component ---

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// --- Schema generators ---

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Artisanat marocain authentique - Tapis, Poterie, Bijoux, Maroquinerie",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Marrakech",
      addressCountry: "MA",
    },
    sameAs: [
      "https://www.instagram.com/artisanatpremium",
      "https://www.facebook.com/artisanatpremium",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+212-600-000000",
      contactType: "customer service",
      availableLanguage: ["French", "Arabic"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/fr/recherche?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

interface ProductJsonLdInput {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  priceMad: number | string;
  priceEur: number | string;
  stock: number;
  sku?: string | null;
  artisan: string;
  origin: string;
  images: Array<{ url: string; alt?: string | null }>;
  category: { slug: string; name: string };
  aggregateRating?: { ratingValue: number; reviewCount: number } | null;
}

export function productJsonLd(product: ProductJsonLdInput) {
  const url = `${SITE_URL}/fr/${product.category.slug}/${product.slug}`;

  let availability = "https://schema.org/InStock";
  if (product.stock === 0) {
    availability = "https://schema.org/OutOfStock";
  }

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description,
    image: product.images.map((img) => img.url),
    sku: product.sku || undefined,
    brand: {
      "@type": "Brand",
      name: product.artisan,
    },
    manufacturer: {
      "@type": "Organization",
      name: product.artisan,
      address: {
        "@type": "PostalAddress",
        addressRegion: product.origin,
        addressCountry: "MA",
      },
    },
    offers: [
      {
        "@type": "Offer",
        url,
        priceCurrency: "MAD",
        price: Number(product.priceMad),
        availability,
        seller: { "@type": "Organization", name: SITE_NAME },
      },
      {
        "@type": "Offer",
        url,
        priceCurrency: "EUR",
        price: Number(product.priceEur),
        availability,
        seller: { "@type": "Organization", name: SITE_NAME },
      },
    ],
  };

  if (product.aggregateRating && product.aggregateRating.reviewCount > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.aggregateRating.ratingValue,
      reviewCount: product.aggregateRating.reviewCount,
    };
  }

  return data;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const entry: Record<string, unknown> = {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
      };
      if (item.href) {
        entry.item = `${SITE_URL}${item.href}`;
      }
      return entry;
    }),
  };
}

interface FaqItem {
  question: string;
  answer: string;
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
