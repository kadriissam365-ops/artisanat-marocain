'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useSession } from 'next-auth/react';
import { Package, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDate } from '@/lib/utils';

interface OrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  currency: string;
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
  items: { productName: string; quantity: number; unitPrice: number }[];
}

export default function OrdersPage() {
  const t = useTranslations('orders');
  const { data: session, status: authStatus } = useSession();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authStatus !== 'authenticated') return;

    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [authStatus]);

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'confirmed':
      case 'processing':
        return 'default';
      case 'shipped':
        return 'secondary';
      case 'delivered':
        return 'success';
      case 'cancelled':
      case 'refunded':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (authStatus === 'loading' || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4 max-w-3xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-xl p-6">
              <div className="h-4 bg-sand-100 rounded w-1/4 mb-2" />
              <div className="h-6 bg-sand-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Veuillez vous connecter</h1>
        <Button asChild>
          <Link href="/login">Se connecter</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-terracotta-700 mb-4">
          {t('title')}
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-terracotta-500 to-sand-400 mx-auto rounded-full" />
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-gray-600 mb-6">{t('empty')}</p>
          <Button asChild>
            <Link href="/boutique">Decouvrir nos produits</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl mx-auto">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Commande {order.orderNumber}
                    </p>
                    <p className="font-semibold text-lg">
                      {formatPrice(order.totalAmount)} {order.currency}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={getStatusVariant(order.status)}>
                      {t(`status.${order.status.toLowerCase()}`)}
                    </Badge>
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-terracotta-600 hover:text-terracotta-700"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-500">
                  {order.items.length} article{order.items.length > 1 ? 's' : ''}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
