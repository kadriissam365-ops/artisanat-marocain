'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-terracotta-800 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-xl text-sand-300 mb-4">
              {t('common.siteName')}
            </h3>
            <p className="text-terracotta-200 text-sm leading-relaxed">
              {t('about.description').substring(0, 150)}...
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-medium text-sand-300 mb-4">
              {t('footer.navigation')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-terracotta-200 hover:text-sand-300 transition-colors text-sm">
                  {t('common.home')}
                </Link>
              </li>
              <li>
                <Link href="/boutique" className="text-terracotta-200 hover:text-sand-300 transition-colors text-sm">
                  {t('common.shop')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-terracotta-200 hover:text-sand-300 transition-colors text-sm">
                  {t('common.about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-terracotta-200 hover:text-sand-300 transition-colors text-sm">
                  {t('common.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-medium text-sand-300 mb-4">
              {t('footer.customerService')}
            </h3>
            <ul className="space-y-2">
              <li>
                <span className="text-terracotta-200 text-sm">{t('footer.shipping')}</span>
              </li>
              <li>
                <span className="text-terracotta-200 text-sm">{t('footer.returns')}</span>
              </li>
              <li>
                <span className="text-terracotta-200 text-sm">{t('footer.faq')}</span>
              </li>
              <li>
                <span className="text-terracotta-200 text-sm">{t('footer.terms')}</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-medium text-sand-300 mb-4">
              {t('footer.contact')}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-sand-400 shrink-0" />
                <a href={`tel:${t('common.phone')}`} className="text-terracotta-200 hover:text-sand-300 text-sm">
                  {t('common.phone')}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-sand-400 shrink-0" />
                <a href={`mailto:${t('common.email')}`} className="text-terracotta-200 hover:text-sand-300 text-sm">
                  {t('common.email')}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-sand-400 shrink-0" />
                <span className="text-terracotta-200 text-sm">{t('common.address')}</span>
              </li>
            </ul>

            {/* Social */}
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-terracotta-700 text-center">
          <p className="text-terracotta-300 text-sm">
            &copy; {new Date().getFullYear()} {t('common.siteName')}. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
