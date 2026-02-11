'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useCurrencyStore } from '@/stores/currencyStore';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { ProductListItem } from '@/types';

interface ProductCardProps {
  product: ProductListItem;
  locale: string;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { currency } = useCurrencyStore();

  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const price = currency === 'MAD' ? product.priceMad : product.priceEur;
  const comparePrice = currency === 'MAD' ? product.compareAtPriceMad : product.compareAtPriceEur;
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      categorySlug: product.category.slug,
      priceMad: product.priceMad,
      priceEur: product.priceEur,
      stock: product.stock,
      imageUrl: primaryImage?.url || null,
      imageAlt: primaryImage?.alt || null,
    });
    if (result.success) {
      openCart();
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
  };

  return (
    <Link href={`/${product.category.slug}/${product.slug}`}>
      <Card className="group card-hover overflow-hidden h-full">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              placeholder={primaryImage.blurDataURL ? 'blur' : 'empty'}
              blurDataURL={primaryImage.blurDataURL || undefined}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <span className="text-4xl">&#9670;</span>
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
            aria-label={wishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-colors',
                wishlisted ? 'fill-terracotta-500 text-terracotta-500' : 'text-gray-600'
              )}
            />
          </button>

          {/* Discount badge */}
          {comparePrice && comparePrice > price && (
            <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded">
              -{Math.round(((comparePrice - price) / comparePrice) * 100)}%
            </span>
          )}

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-foreground text-sm font-medium px-3 py-1 rounded">
                Rupture de stock
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-2">
          <p className="text-xs text-muted-foreground">
            {product.artisan} &middot; {product.origin}
          </p>

          <h3 className="font-medium text-foreground line-clamp-2 text-sm leading-tight group-hover:text-terracotta-500 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-terracotta-600">
              {formatPrice(price, currency, locale)}
            </span>
            {comparePrice && comparePrice > price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(comparePrice, currency, locale)}
              </span>
            )}
          </div>

          <Button
            variant="default"
            size="sm"
            className="w-full mt-2"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
