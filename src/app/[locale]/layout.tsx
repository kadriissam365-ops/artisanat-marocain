import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ThemeProvider } from 'next-themes';
import { Playfair_Display, Inter, Noto_Sans_Arabic } from 'next/font/google';

import { locales, localeDirection, type Locale } from '@/i18n/config';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { ToastProvider } from '@/components/ui/toast';
import { JsonLd, organizationJsonLd, websiteJsonLd } from '@/components/seo/JsonLd';

import '../globals.css';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-arabic',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://artisanat-marocain.ma'),
  title: {
    default: 'Artisanat Marocain Premium | Tapis, Poterie, Bijoux Authentiques',
    template: '%s | Artisanat Premium',
  },
  description: 'Découvrez l\'artisanat marocain authentique : tapis berbères, poterie de Fès, bijoux en argent, maroquinerie, zellige. Livraison Maroc & Europe. Paiement sécurisé.',
  keywords: ['artisanat marocain', 'tapis berbère', 'poterie fès', 'bijoux argent maroc', 'maroquinerie', 'zellige', 'décoration marocaine', 'artisan maroc'],
  authors: [{ name: 'Artisanat Premium' }],
  creator: 'Artisanat Premium',
  publisher: 'Artisanat Premium',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  alternates: {
    canonical: '/',
    languages: {
      'fr': '/fr',
      'ar': '/ar',
    },
  },
  openGraph: {
    title: 'Artisanat Marocain Premium | Pièces Uniques & Authentiques',
    description: 'Découvrez des pièces uniques façonnées par les artisans les plus talentueux du Maroc. Tapis, poterie, bijoux, maroquinerie.',
    type: 'website',
    locale: 'fr_MA',
    alternateLocale: ['ar_MA'],
    siteName: 'Artisanat Premium',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Artisanat Marocain Premium - Pièces Authentiques',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artisanat Marocain Premium',
    description: 'Découvrez l\'artisanat marocain authentique : tapis, poterie, bijoux, maroquinerie.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
  icons: {
    icon: [
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const direction = localeDirection[locale as Locale];
  const isRtl = direction === 'rtl';

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${playfairDisplay.variable} ${inter.variable} ${notoSansArabic.variable}`}
      suppressHydrationWarning
    >
      <body className={isRtl ? 'font-arabic antialiased' : 'font-body antialiased'}>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider messages={messages}>
              <ToastProvider>
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <WhatsAppButton />
                </div>
              </ToastProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
