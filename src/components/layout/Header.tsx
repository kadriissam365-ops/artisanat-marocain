'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Menu, X, Search, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/stores/cartStore';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';
import { CurrencySwitcher } from './CurrencySwitcher';
import { UserMenu } from './UserMenu';
import { CartSidebar } from '@/components/cart/CartSidebar';

export function Header() {
  const t = useTranslations('common');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { getTotalItems, openCart } = useCartStore();

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('shop'), href: '/boutique' },
    { name: t('about'), href: '/about' },
    { name: t('contact'), href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full hero-gradient shadow-lg">
        <nav className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="text-lg font-heading font-bold text-white hidden sm:block">
                {t('siteName')}
              </span>
              <span className="text-lg font-heading font-bold text-white sm:hidden">
                Artisanat
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('searchPlaceholder')}
                  className="pl-10 bg-white/90 border-0 focus:bg-white"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Mobile Search Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:bg-white/10"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Currency Switcher */}
              <CurrencySwitcher />

              {/* Theme Switcher */}
              <ThemeSwitcher />

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Cart Button */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:bg-white/10"
                onClick={openCart}
                aria-label={`${t('cart')} (${getTotalItems()})`}
              >
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white text-terracotta-600 text-xs font-bold flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Button>

              {/* User Menu */}
              <UserMenu />

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-white/10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          {searchOpen && (
            <div className="md:hidden py-3 border-t border-white/20">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('searchPlaceholder')}
                  className="pl-10 bg-white/90 border-0"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-white/20">
              <div className="flex flex-col gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  );
}
