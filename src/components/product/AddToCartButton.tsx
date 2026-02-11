'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { useToast } from '@/components/ui/toast';
import type { Product } from '@/types';

interface AddToCartButtonProps {
  product: Pick<Product, 'id' | 'name' | 'slug' | 'priceMad' | 'priceEur' | 'stock' | 'category' | 'images'>;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem, openCart } = useCartStore();
  const { addToast } = useToast();

  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];

  const handleAddToCart = () => {
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
      addToast(result.message, 'success');
      openCart();
    } else {
      addToast(result.message, 'error');
    }
  };

  return (
    <Button
      className="w-full btn-gradient text-white py-3 px-6 font-medium"
      size="lg"
      onClick={handleAddToCart}
      disabled={product.stock === 0}
    >
      <ShoppingCart className="h-5 w-5 mr-2" />
      {product.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
    </Button>
  );
}
