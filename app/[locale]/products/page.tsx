'use client';

// Products listing page component
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2, Filter, Grid, List } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product, ProductCategory, FilterOptions } from '@/lib/types';
import { getAllProducts, getFilteredProducts } from '@/lib/services/products';
import { toast } from 'sonner';

/**
 * Products listing page component
 */
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('newest');
  const searchParams = useSearchParams();
  const t = useTranslations();
  const locale = useLocale();

  // Get filter parameters from URL
  const category = searchParams.get('category') as ProductCategory | null;
  const featured = searchParams.get('featured') === 'true';

  /**
   * Fetch products based on filters
   */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const filters: FilterOptions = {};
      if (category) filters.category = category;
      if (featured) filters.featured = true;
      
      let fetchedProducts: Product[];
      if (Object.keys(filters).length > 0) {
        fetchedProducts = await getFilteredProducts(filters);
      } else {
        fetchedProducts = await getAllProducts();
      }
      
      // Apply sorting
      const sortedProducts = sortProducts(fetchedProducts, sortBy);
      setProducts(sortedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error(t('products.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sort products based on selected criteria
   */
  const sortProducts = (products: Product[], sortBy: string): Product[] => {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-az':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-za':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted;
    }
  };

  /**
   * Handle sort change
   */
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    const sortedProducts = sortProducts(products, newSortBy);
    setProducts(sortedProducts);
  };

  /**
   * Get page title based on filters
   */
  const getPageTitle = () => {
    if (featured) return t('navigation.featured');
    if (category) {
      switch (category) {
        case ProductCategory.SHIRTS:
          return t('categories.shirts.name');
        case ProductCategory.PANTS:
          return t('categories.pants.name');
        case ProductCategory.DRESSES:
          return t('categories.dresses.name');
        case ProductCategory.JACKETS:
          return t('categories.jackets.name');
        case ProductCategory.SHOES:
          return t('categories.shoes.name');
        case ProductCategory.ACCESSORIES:
          return t('categories.accessories.name');
        default:
          return t('navigation.allProducts');
      }
    }
    return t('navigation.allProducts');
  };

  /**
   * Get page description based on filters
   */
  const getPageDescription = () => {
    if (featured) return 'Discover our handpicked selection of premium clothing items';
    if (category) {
      switch (category) {
        case ProductCategory.SHIRTS:
          return t('categories.shirts.description');
        case ProductCategory.PANTS:
          return t('categories.pants.description');
        case ProductCategory.DRESSES:
          return t('categories.dresses.description');
        case ProductCategory.JACKETS:
          return t('categories.jackets.description');
        case ProductCategory.SHOES:
          return t('categories.shoes.description');
        case ProductCategory.ACCESSORIES:
          return t('categories.accessories.description');
        default:
          return 'Browse our complete collection of premium clothing';
      }
    }
    return 'Browse our complete collection of premium clothing';
  };

  // Fetch products on component mount and when filters change
  useEffect(() => {
    fetchProducts();
  }, [category, featured]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-gray-50 dark:bg-gray-900 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {getPageTitle()}
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {getPageDescription()}
              </p>
              
              {/* Active Filters */}
              {(category || featured) && (
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {featured && (
                    <Badge variant="secondary">
                      {t('navigation.featured')}
                    </Badge>
                  )}
                  {category && (
                    <Badge variant="secondary">
                      {getPageTitle()}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="container mx-auto px-4 py-8">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              {loading ? (
                t('common.loading')
              ) : (
                `${products.length} ${products.length === 1 ? 'product' : 'products'} found`
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name-az">Name: A to Z</SelectItem>
                  <SelectItem value="name-za">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {t('products.noProducts')}
              </p>
              <Button asChild>
                <a href={`/${locale}`}>Back to Home</a>
              </Button>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}>
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  className={viewMode === 'list' ? 'flex-row' : ''}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}