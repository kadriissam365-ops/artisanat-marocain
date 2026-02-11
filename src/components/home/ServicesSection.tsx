'use client';

import { useTranslations } from 'next-intl';
import { ShieldCheck, Award, Truck, Headphones } from 'lucide-react';

export function ServicesSection() {
  const t = useTranslations('services');

  const services = [
    {
      icon: ShieldCheck,
      title: t('authenticity.title'),
      description: t('authenticity.description'),
    },
    {
      icon: Award,
      title: t('quality.title'),
      description: t('quality.description'),
    },
    {
      icon: Truck,
      title: t('shipping.title'),
      description: t('shipping.description'),
    },
    {
      icon: Headphones,
      title: t('support.title'),
      description: t('support.description'),
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-terracotta-700 mb-4">
            {t('title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-terracotta-500 to-sand-400 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-gradient-to-b from-sand-50 to-white border border-sand-100 hover:shadow-lg transition-all duration-300 card-hover"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-terracotta-100 text-terracotta-600 mb-4">
                <service.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-terracotta-700 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
