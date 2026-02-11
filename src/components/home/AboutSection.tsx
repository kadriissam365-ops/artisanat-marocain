'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Target, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AboutSection() {
  const t = useTranslations('about');

  const values = [
    {
      icon: Target,
      title: t('mission.title'),
      description: t('mission.description'),
    },
    {
      icon: Heart,
      title: t('values.title'),
      description: t('values.description'),
    },
  ];

  return (
    <section className="py-16 bg-sand-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-terracotta-700 mb-4">
            {t('title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-terracotta-500 to-sand-400 mx-auto rounded-full" />
          <p className="text-gray-600 mt-6 max-w-3xl mx-auto text-lg leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {values.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-terracotta-100 text-terracotta-600 mb-4">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-terracotta-700 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" size="lg" asChild className="border-terracotta-300 text-terracotta-700 hover:bg-terracotta-50">
            <Link href="/about" className="group">
              {t('title')}
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:ml-0 rtl:mr-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
