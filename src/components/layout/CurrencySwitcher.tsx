'use client';

import { useCurrencyStore } from '@/stores/currencyStore';
import { Button } from '@/components/ui/button';

export function CurrencySwitcher() {
  const { currency, toggleCurrency } = useCurrencyStore();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleCurrency}
      className="text-white hover:bg-white/10 font-medium text-xs px-2"
      aria-label={`Changer la devise (actuellement ${currency})`}
    >
      {currency}
    </Button>
  );
}
