'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { useCurrencyStore } from '@/stores/currencyStore';
import { useToast } from '@/components/ui/toast';
import { formatPrice } from '@/lib/utils';

export function CartSidebar() {
  const t = useTranslations('cart');
  const { addToast } = useToast();
  const { currency } = useCurrencyStore();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getTotalItems,
    getSubtotal,
  } = useCartStore();

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    const result = updateQuantity(productId, newQuantity);
    if (!result.success) {
      addToast(result.message, 'error');
    }
  };

  const handleRemove = (productId: string) => {
    removeItem(productId);
    addToast(t('itemRemoved'), 'info');
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        role="dialog"
        aria-label={t('title')}
        aria-modal="true"
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-background shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } rtl:right-auto rtl:left-0 ${
          isOpen ? 'rtl:-translate-x-0' : 'rtl:-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 hero-gradient text-white">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {t('title')} ({getTotalItems()})
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={closeCart}
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-8rem)]">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium text-foreground">{t('empty')}</p>
              <p className="text-sm text-muted-foreground mt-2">{t('emptyMessage')}</p>
              <Button
                className="mt-6"
                onClick={closeCart}
                asChild
              >
                <Link href="/boutique">{t('continueShopping')}</Link>
              </Button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  {/* Product image */}
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-muted shrink-0">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.imageAlt || item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xl">
                        &#9670;
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground text-sm truncate">
                      {item.name}
                    </h4>
                    <p className="text-terracotta-600 font-bold text-sm">
                      {formatPrice(
                        currency === 'MAD' ? item.priceMad : item.priceEur,
                        currency
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                    onClick={() => handleRemove(item.productId)}
                    aria-label={`${t('remove')} ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-muted/50 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-base font-medium">{t('subtotal')}</span>
              <span className="text-lg font-bold text-terracotta-600">
                {formatPrice(getSubtotal(currency), currency)}
              </span>
            </div>
            <Button
              className="w-full btn-gradient text-white"
              size="lg"
              onClick={closeCart}
              asChild
            >
              <Link href="/checkout">{t('checkout')}</Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
