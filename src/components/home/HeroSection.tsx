'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section className="relative min-h-[70vh] flex items-center hero-gradient overflow-hidden">
      {/* Background Pattern - Zellige inspired */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white/20" />
        <div className="absolute bottom-20 right-40 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-white/15" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 animate-fade-in-up">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {t('subtitle')}
          </p>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button
              size="lg"
              className="bg-white text-terracotta-700 hover:bg-sand-100 font-semibold px-8 py-3 text-lg group"
              asChild
            >
              <Link href="/boutique">
                {t('cta')}
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:ml-0 rtl:mr-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
            <div className="text-4xl font-bold text-sand-300">500+</div>
            <div className="text-gray-200 mt-1">{t('stats.products')}</div>
          </div>
          <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
            <div className="text-4xl font-bold text-sand-300">50+</div>
            <div className="text-gray-200 mt-1">{t('stats.artisans')}</div>
          </div>
          <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
            <div className="text-4xl font-bold text-sand-300">8</div>
            <div className="text-gray-200 mt-1">{t('stats.cities')}</div>
          </div>
          <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
            <div className="text-4xl font-bold text-sand-300">2000+</div>
            <div className="text-gray-200 mt-1">{t('stats.clients')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
