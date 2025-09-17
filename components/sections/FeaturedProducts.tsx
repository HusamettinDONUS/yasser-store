"use client";

// Featured products section component
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { Product } from "@/lib/types";
import { getFeaturedProducts } from "@/lib/services/products";
import { toast } from "sonner";

interface FeaturedProductsProps {
  limit?: number;
  showViewAll?: boolean;
}

/**
 * Featured products section component
 */
export function FeaturedProducts({
  limit = 8,
  showViewAll = true,
}: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations();
  const locale = useLocale();

  /**
   * Fetch featured products from API
   */
  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProducts = await getFeaturedProducts(8);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      setError("Failed to load featured products");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch featured products on component mount
   */
  useEffect(() => {
    fetchFeaturedProducts();
  }, [limit]);

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("products.featured")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("products.featuredDescription")}
            </p>
          </div>

          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("products.featured")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("products.featuredDescription")}
            </p>
          </div>

          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {error || t("products.noProducts")}
            </p>
            <Button asChild>
              <Link href={`/${locale}/products`}>
                {t("products.browseAll")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("products.featured")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("products.featuredDescription")}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showQuickActions={true}
            />
          ))}
        </div>

        {/* View All Button */}
        {showViewAll && (
          <div className="text-center">
            <Button size="lg" variant="outline" asChild className="group">
              <Link href={`/${locale}/products?featured=true`}>
                {t("products.viewAllFeatured")}
                <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
