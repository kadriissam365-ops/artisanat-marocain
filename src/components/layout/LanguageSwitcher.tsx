'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { locales, localeNames, type Locale } from '@/i18n/config';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const newLocale = locale === 'fr' ? 'ar' : 'fr';
    router.replace(pathname, { locale: newLocale });
  };

  const otherLocale = locale === 'fr' ? 'ar' : 'fr';

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-white hover:bg-white/10 gap-2"
      onClick={switchLocale}
    >
      <Globe className="h-4 w-4" />
      <span className="hidden sm:inline">{localeNames[otherLocale]}</span>
    </Button>
  );
}
