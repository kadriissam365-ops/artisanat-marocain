'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useSession, signOut } from 'next-auth/react';
import { User, LogOut, Package, Heart, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function UserMenu() {
  const t = useTranslations('common');
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    signOut();
    setIsOpen(false);
  };

  const isAuthenticated = !!session?.user;
  const userName = session?.user?.name || session?.user?.email || '';

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-white/10"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('profile')}
      >
        {isAuthenticated ? (
          <span className="h-8 w-8 rounded-full bg-sand-400 text-terracotta-900 flex items-center justify-center text-sm font-bold">
            {userName.charAt(0).toUpperCase()}
          </span>
        ) : (
          <User className="h-5 w-5" />
        )}
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 animate-fade-in-up">
          {isAuthenticated ? (
            <>
              <div className="px-4 py-3 border-b">
                <p className="font-medium text-gray-900">{userName}</p>
                <p className="text-sm text-gray-500">{session?.user?.email}</p>
              </div>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-4 w-4" />
                {t('profile')}
              </Link>
              <Link
                href="/orders"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Package className="h-4 w-4" />
                {t('orders')}
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Heart className="h-4 w-4" />
                {t('wishlist')}
              </Link>
              <hr className="my-2" />
              <button
                className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                {t('logout')}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4" />
                {t('login')}
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4" />
                {t('register')}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
