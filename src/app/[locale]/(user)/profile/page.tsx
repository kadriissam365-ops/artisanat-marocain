'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useSession } from 'next-auth/react';
import { User, Mail, Calendar, ShoppingBag, Heart, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-24 w-24 rounded-full bg-sand-100 mx-auto" />
          <div className="h-6 bg-sand-100 rounded w-48 mx-auto" />
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-700 mb-4">
          Veuillez vous connecter
        </h1>
        <Link href="/login">
          <Button>{tCommon('login')}</Button>
        </Link>
      </div>
    );
  }

  const user = session.user;
  const userName = user.name || user.email || '';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-terracotta-700 mb-4">
          {t('title')}
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-terracotta-500 to-sand-400 mx-auto rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-terracotta-500 to-sand-400 mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4">
                {userName.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{userName}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-2">
                <Calendar className="h-4 w-4" />
                <span>Membre</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-2">
              <Link
                href="/orders"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ShoppingBag className="h-5 w-5 text-terracotta-600" />
                <span>{tCommon('orders')}</span>
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Heart className="h-5 w-5 text-terracotta-600" />
                <span>{tCommon('wishlist')}</span>
              </Link>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <Settings className="h-5 w-5 text-terracotta-600" />
                <span>Parametres</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('info')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4" />
                    Nom
                  </label>
                  <p className="p-3 bg-gray-50 rounded-lg">{userName}</p>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <p className="p-3 bg-gray-50 rounded-lg">{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
