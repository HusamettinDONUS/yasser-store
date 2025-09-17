"use client";

// Product card component for displaying individual products
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
  showQuickActions?: boolean;
}

/**
 * Product card component for displaying individual products
 */
export function ProductCard({
  product,
  className,
  showQuickActions = true,
}: ProductCardProps) {
  const t = useTranslations();
  const locale = useLocale();

  /**
   * Format price with currency
   */
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all hover:shadow-lg",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden">
        {/* Product Image */}
        <Link href={`/${locale}/products/${product.id}`}>
          <div className="relative w-full h-full bg-gray-100">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <ShoppingCart className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 rtl:left-auto rtl:right-2 flex flex-col gap-1">
          {product.featured && (
            <Badge variant="destructive" className="text-xs">
              {t("navigation.featured")}
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="secondary" className="text-xs">
              {t("products.outOfStock")}
            </Badge>
          )}
        </div>

        {/* Quick View Action */}
        {showQuickActions && (
          <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="secondary" className="h-8 w-8" asChild>
              <Link href={`/${locale}/products/${product.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}

        {/* Quick View Button */}
        {showQuickActions && (
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" className="w-full" variant="secondary" asChild>
              <Link href={`/${locale}/products/${product.id}`}>
                <Eye className="mr-2 rtl:mr-0 rtl:ml-2 h-4 w-4" />
                {t("common.view")}
              </Link>
            </Button>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Product Info */}
        <div className="space-y-2">
          <Link href={`/${locale}/products/${product.id}`}>
            <h3 className="font-medium text-sm md:text-base line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>

            {/* Available Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex gap-1">
                {product.sizes.slice(0, 3).map((size) => (
                  <Badge
                    key={size}
                    variant="outline"
                    className="text-xs px-1 py-0"
                  >
                    {size}
                  </Badge>
                ))}
                {product.sizes.length > 3 && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    +{product.sizes.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {t("products.colors")}:
              </span>
              <div className="flex gap-1">
                {product.colors.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs text-muted-foreground">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Stock Info */}
          {product.inStock &&
            product.stockQuantity &&
            product.stockQuantity < 10 && (
              <p className="text-xs text-orange-600">
                {t("products.onlyLeft", { count: product.stockQuantity })}
              </p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
