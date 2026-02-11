'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useSession } from 'next-auth/react';
import { Check, ShoppingBag, Truck, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/stores/cartStore';
import { useCurrencyStore } from '@/stores/currencyStore';
import { useToast } from '@/components/ui/toast';
import { formatPrice } from '@/lib/utils';
import { Link } from '@/i18n/navigation';

type CheckoutStep = 1 | 2 | 3;

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  const router = useRouter();
  const { addToast } = useToast();
  const { data: session } = useSession();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { currency, getSymbol } = useCurrencyStore();

  const [step, setStep] = useState<CheckoutStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    street2: '',
    city: '',
    postalCode: '',
    country: 'MA',
    notes: '',
    termsAccepted: false,
  });

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (stepNum: CheckoutStep): boolean => {
    switch (stepNum) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.phone);
      case 2:
        return !!(formData.street && formData.city && formData.postalCode);
      case 3:
        return formData.termsAccepted;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 3) as CheckoutStep);
    } else {
      addToast('Veuillez remplir tous les champs obligatoires', 'error');
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1) as CheckoutStep);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      addToast('Veuillez accepter les conditions', 'error');
      return;
    }

    if (!session?.user) {
      addToast('Veuillez vous connecter', 'error');
      router.push('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create shipping address
      const addrRes = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          street: formData.street,
          street2: formData.street2 || undefined,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
          isDefault: true,
        }),
      });

      if (!addrRes.ok) {
        const err = await addrRes.json();
        throw new Error(err.error || 'Erreur lors de la sauvegarde de l\'adresse');
      }

      const { address } = await addrRes.json();

      // 2. Sync local cart to server cart
      // First clear existing server cart items
      const cartRes = await fetch('/api/cart');
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        const serverItems = cartData.cart?.items || [];
        if (serverItems.length > 0) {
          await Promise.all(
            serverItems.map((item: { id: string }) =>
              fetch(`/api/cart/items/${item.id}`, { method: 'DELETE' })
            )
          );
        }
      }

      // Add local cart items to server
      for (const item of items) {
        const addRes = await fetch('/api/cart/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: item.productId,
            quantity: item.quantity,
          }),
        });

        if (!addRes.ok) {
          const err = await addRes.json();
          throw new Error(err.error || `Erreur pour le produit ${item.name}`);
        }
      }

      // 3. Create Stripe checkout session
      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currency,
          shippingAddressId: address.id,
        }),
      });

      if (!checkoutRes.ok) {
        const err = await checkoutRes.json();
        throw new Error(err.error || 'Erreur lors de la creation du paiement');
      }

      const { sessionUrl } = await checkoutRes.json();

      // 4. Clear local cart and redirect to Stripe
      clearCart();

      if (sessionUrl) {
        window.location.href = sessionUrl;
      } else {
        addToast(t('confirmation.title'), 'success');
        router.push('/orders');
      }
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : 'Une erreur est survenue',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
        <Button asChild>
          <Link href="/boutique">Decouvrir nos produits</Link>
        </Button>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Connectez-vous pour commander</h1>
        <p className="text-gray-600 mb-6">
          Vous devez etre connecte pour finaliser votre commande.
        </p>
        <Button asChild>
          <Link href="/login">Se connecter</Link>
        </Button>
      </div>
    );
  }

  const subtotal = getSubtotal(currency);
  const shipping = 0;
  const total = subtotal + shipping;
  const sym = getSymbol();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-heading font-bold text-terracotta-700 mb-8 text-center">
        {t('title')}
      </h1>

      {/* Steps Indicator */}
      <div className="flex justify-between mb-10 relative">
        {[
          { num: 1, icon: ShoppingBag, label: t('steps.info') },
          { num: 2, icon: Truck, label: t('steps.delivery') },
          { num: 3, icon: CreditCard, label: t('steps.payment') },
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center relative z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                s.num < step
                  ? 'bg-green-500 text-white'
                  : s.num === step
                  ? 'bg-terracotta-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s.num < step ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
            </div>
            <span className="text-sm mt-2 text-gray-600">{s.label}</span>
          </div>
        ))}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {/* Step 1: Customer Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-terracotta-700 mb-4">
                    {t('customerInfo.title')}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prenom *
                      </label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom *
                      </label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => updateField('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('customerInfo.phone')} *
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+212 6XX XXX XXX"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Delivery Address */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-terracotta-700 mb-4">
                    {t('deliveryInfo.title')}
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('deliveryInfo.address')} *
                    </label>
                    <Input
                      value={formData.street}
                      onChange={(e) => updateField('street', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Complement d&apos;adresse
                    </label>
                    <Input
                      value={formData.street2}
                      onChange={(e) => updateField('street2', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('deliveryInfo.city')} *
                      </label>
                      <Input
                        value={formData.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code postal *
                      </label>
                      <Input
                        value={formData.postalCode}
                        onChange={(e) => updateField('postalCode', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pays
                    </label>
                    <Select
                      value={formData.country}
                      onChange={(e) => updateField('country', e.target.value)}
                    >
                      <option value="MA">Maroc</option>
                      <option value="FR">France</option>
                      <option value="BE">Belgique</option>
                      <option value="ES">Espagne</option>
                      <option value="DE">Allemagne</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('deliveryInfo.notes')}
                    </label>
                    <textarea
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500"
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => updateField('notes', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-terracotta-700 mb-4">
                    {t('payment.title')}
                  </h2>
                  <div className="bg-sand-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <CreditCard className="h-5 w-5 text-terracotta-600" />
                      <span className="font-medium">Paiement securise par Stripe</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Vous serez redirige vers Stripe pour effectuer votre paiement de maniere securisee.
                      Cartes Visa, Mastercard et autres acceptees.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.termsAccepted}
                      onChange={(e) => updateField('termsAccepted', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-terracotta-500 focus:ring-terracotta-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      {t('payment.terms')} *
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
                    {t('buttons.previous')}
                  </Button>
                )}
                <div className="ml-auto">
                  {step < 3 ? (
                    <Button onClick={nextStep}>{t('buttons.next')}</Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !formData.termsAccepted}
                      className="min-w-[200px]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        t('buttons.confirm')
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-20">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Recapitulatif</h3>
              <div className="space-y-3">
                {items.map((item) => {
                  const price = currency === 'MAD' ? item.priceMad : item.priceEur;
                  return (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x {item.quantity}
                      </span>
                      <span>{formatPrice(price * item.quantity)} {sym}</span>
                    </div>
                  );
                })}
                <hr />
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal)} {sym}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Livraison</span>
                  <span>{shipping === 0 ? 'Gratuite' : `${formatPrice(shipping)} ${sym}`}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-terracotta-600">
                    {formatPrice(total)} {sym}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
