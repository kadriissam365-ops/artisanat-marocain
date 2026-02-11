import { setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProducts } from '@/components/home/FeaturedRaces';
import { ServicesSection } from '@/components/home/ServicesSection';
import { AboutSection } from '@/components/home/AboutSection';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <ServicesSection />
      <AboutSection />
    </>
  );
}
