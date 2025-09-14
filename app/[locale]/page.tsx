import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { CategoriesSection } from "@/components/sections/CategoriesSection";

interface HomeProps {
  params: Promise<{ locale: string }>;
}

// Generate static params for all supported locales
export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

/**
 * Homepage component with internationalization support
 */
export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <FeaturedProducts />
        <CategoriesSection />
      </main>

      <Footer />
    </div>
  );
}
