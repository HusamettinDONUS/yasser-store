'use client';

// Categories section component for the homepage
import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, Shirt, Zap, Crown, Package, Footprints, Watch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCategory } from '@/lib/types';

/**
 * Category item interface
 */
interface CategoryItem {
  name: string;
  category: ProductCategory;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  href: string;
}

/**
 * Categories section component
 */
export function CategoriesSection() {
  const t = useTranslations();
  const locale = useLocale();
  
  /**
   * Category configuration
   */
  const categories: CategoryItem[] = [
    {
      name: t('categories.shirts.name'),
      category: ProductCategory.SHIRTS,
      description: t('categories.shirts.description'),
      icon: Shirt,
      color: 'bg-blue-500',
      href: `/${locale}/products?category=shirts`
    },
    {
      name: t('categories.pants.name'),
      category: ProductCategory.PANTS,
      description: t('categories.pants.description'),
      icon: Zap,
      color: 'bg-green-500',
      href: `/${locale}/products?category=pants`
    },
    {
      name: t('categories.dresses.name'),
      category: ProductCategory.DRESSES,
      description: t('categories.dresses.description'),
      icon: Crown,
      color: 'bg-pink-500',
      href: `/${locale}/products?category=dresses`
    },
    {
      name: t('categories.jackets.name'),
      category: ProductCategory.JACKETS,
      description: t('categories.jackets.description'),
      icon: Package,
      color: 'bg-orange-500',
      href: `/${locale}/products?category=jackets`
    },
    {
      name: t('categories.shoes.name'),
      category: ProductCategory.SHOES,
      description: t('categories.shoes.description'),
      icon: Footprints,
      color: 'bg-purple-500',
      href: `/${locale}/products?category=shoes`
    },
    {
      name: t('categories.accessories.name'),
      category: ProductCategory.ACCESSORIES,
      description: t('categories.accessories.description'),
      icon: Watch,
      color: 'bg-indigo-500',
      href: `/${locale}/products?category=accessories`
    }
  ];

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Gallery Collections
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our carefully organized fashion collections. Each category showcases unique styles and designs for every occasion.
          </p>
        </div>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon;
            
            return (
              <Link key={category.category} href={category.href}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Icon */}
                      <div className={`${category.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {category.description}
                        </p>
                        
                        {/* Arrow */}
                        <div className="flex items-center text-primary text-sm font-medium">
                          <span>{t('categories.shopNow')}</span>
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
        
        {/* View All Categories Button */}
        <div className="text-center">
          <Button size="lg" variant="outline" asChild className="group">
            <Link href={`/${locale}/products`}>
              {t('categories.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}