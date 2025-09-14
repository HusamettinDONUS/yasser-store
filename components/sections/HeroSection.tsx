'use client';

// Hero section component for the homepage
import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag } from 'lucide-react';

/**
 * Hero section component for the homepage
 */
export function HeroSection() {
  const t = useTranslations();
  const locale = useLocale();
  
  return (
    <section className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {t('hero.title')}
                <span className="text-primary block">{t('hero.titleHighlight')}</span>
                {t('hero.titleEnd')}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                {t('hero.description')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="group">
                <Link href={`/${locale}/products`}>
                  {t('hero.shopNow')}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={`/${locale}/products?featured=true`}>
                  {t('hero.viewFeatured')}
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">{t('hero.stats.products')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">{t('hero.stats.customers')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">{t('hero.stats.support')}</div>
              </div>
            </div>
          </div>
          
          {/* Visual */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 md:p-12">
              {/* Placeholder for hero image */}
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center">
                <ShoppingBag className="h-24 w-24 text-primary/30" />
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-full p-4 shadow-lg">
                <ShoppingBag className="h-6 w-6" />
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-background border shadow-lg rounded-lg p-4">
                <div className="text-sm font-medium">{t('hero.features.freeShipping')}</div>
                <div className="text-xs text-muted-foreground">{t('hero.features.freeShippingDesc')}</div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-xl" />
              <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}