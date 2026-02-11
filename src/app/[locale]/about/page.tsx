import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Target, Heart, ShieldCheck, Handshake } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return {
    title: t('title'),
    description: t('description').substring(0, 160),
    alternates: {
      canonical: `/${locale}/about`,
      languages: { fr: '/fr/about', ar: '/ar/about' },
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'about' });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-terracotta-700 mb-4">
          {t('title')}
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-terracotta-500 to-sand-400 mx-auto rounded-full" />
        <p className="text-gray-600 mt-6 max-w-3xl mx-auto text-lg leading-relaxed">
          {t('description')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {[
          { value: '500+', label: 'Produits artisanaux' },
          { value: '50+', label: 'Artisans partenaires' },
          { value: '8', label: 'Villes artisanales' },
          { value: '2000+', label: 'Clients satisfaits' },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-terracotta-600">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mission & Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card>
          <CardContent className="p-8">
            <div className="p-3 rounded-xl bg-terracotta-100 w-fit mb-4">
              <Target className="h-8 w-8 text-terracotta-600" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-terracotta-700 mb-3">
              {t('mission.title')}
            </h3>
            <p className="text-gray-600 leading-relaxed">{t('mission.description')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <div className="p-3 rounded-xl bg-terracotta-100 w-fit mb-4">
              <Heart className="h-8 w-8 text-terracotta-600" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-terracotta-700 mb-3">
              {t('values.title')}
            </h3>
            <p className="text-gray-600 leading-relaxed">{t('values.description')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Story */}
      <div className="bg-sand-50 rounded-2xl p-8 md:p-12">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-terracotta-700 mb-6 text-center">
          Notre Savoir-Faire
        </h2>
        <div className="max-w-3xl mx-auto space-y-4 text-gray-600 leading-relaxed">
          <p>
            Le Maroc est un pays aux mille facettes artisanales. De Fès avec ses poteries
            et zellige, à Marrakech et ses tapis berbères, en passant par Essaouira et le
            travail du bois de thuya, chaque ville recèle un savoir-faire unique transmis
            de génération en génération.
          </p>
          <p>
            Artisanat Premium est né de la volonté de mettre en lumière ces trésors. Nous
            travaillons directement avec les artisans dans leurs ateliers, en leur garantissant
            une rémunération juste et en respectant leurs méthodes traditionnelles.
          </p>
          <p>
            Chaque pièce que nous proposons est sélectionnée avec soin pour sa qualité,
            son authenticité et son caractère unique. Nous vous offrons une expérience d'achat
            transparente, avec la livraison sécurisée au Maroc et en Europe.
          </p>
        </div>
      </div>

      {/* Values Grid */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-terracotta-700 mb-8">
          Nos Engagements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-terracotta-100 text-terracotta-600 mb-4">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-terracotta-700 mb-2">Authenticité</h3>
            <p className="text-gray-600">
              Chaque produit est vérifié et certifié artisanal. Pas de contrefaçons.
            </p>
          </div>
          <div className="p-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-terracotta-100 text-terracotta-600 mb-4">
              <Handshake className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-terracotta-700 mb-2">Commerce Équitable</h3>
            <p className="text-gray-600">
              Rémunération juste des artisans et soutien aux coopératives locales.
            </p>
          </div>
          <div className="p-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-terracotta-100 text-terracotta-600 mb-4">
              <Heart className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-terracotta-700 mb-2">Passion</h3>
            <p className="text-gray-600">
              L'amour de l'artisanat marocain guide chacune de nos sélections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
