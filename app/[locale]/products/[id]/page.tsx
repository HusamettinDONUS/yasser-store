'use client';

// Product detail page component
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowLeft, Heart, ShoppingCart, Share2, Star, Minus, Plus } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Product, ProductSize } from '@/lib/types';
import { getProductById } from '@/lib/services/products';
import { toast } from 'sonner';
import Link from 'next/link';

interface ProductDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

/**
 * Product detail page component
 */
export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [locale, setLocale] = useState('');
  const [productId, setProductId] = useState('');
  const t = useTranslations();

  // Extract params
  useEffect(() => {
    const extractParams = async () => {
      const resolvedParams = await params;
      setLocale(resolvedParams.locale);
      setProductId(resolvedParams.id);
    };
    extractParams();
  }, [params]);

  /**
   * Fetch product details
   */
  const fetchProduct = async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      const fetchedProduct = await getProductById(productId);
      
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        // Set default selections
        if (fetchedProduct.sizes.length > 0) {
          setSelectedSize(fetchedProduct.sizes[0]);
        }
        if (fetchedProduct.colors.length > 0) {
          setSelectedColor(fetchedProduct.colors[0]);
        }
      } else {
        toast.error('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error(t('products.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format price with currency
   */
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  /**
   * Handle contact for inquiry
   */
  const handleContactInquiry = () => {
    if (!product) return;
    
    const message = `Hi, I'm interested in ${product.name}. Could you provide more information?`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  /**
   * Handle quantity change
   */
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stockQuantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  // Fetch product when productId changes
  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>{t('common.loading')}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href={`/${locale}/products`}>Browse Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href={`/${locale}`} className="hover:text-primary">
              {t('common.home')}
            </Link>
            <span>/</span>
            <Link href={`/${locale}/products`} className="hover:text-primary">
              {t('common.products')}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[selectedImageIndex]}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingCart className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                        selectedImageIndex === index ? 'border-primary' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title and Price */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-2xl lg:text-3xl font-bold">{product.name}</h1>
                  <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl lg:text-3xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  
                  {/* Badges */}
                  <div className="flex gap-2">
                    {product.featured && (
                      <Badge variant="destructive">{t('navigation.featured')}</Badge>
                    )}
                    {!product.inStock && (
                      <Badge variant="secondary">{t('products.outOfStock')}</Badge>
                    )}
                  </div>
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(4.5) • 24 reviews</span>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">{t('products.description')}</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">{t('products.sizes')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">{t('products.colors')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 ${
                          selectedColor === color ? 'border-primary' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Contact and Inquiry */}
              <div className="space-y-4">
                {/* Stock Info */}
                {product.inStock && product.stockQuantity && product.stockQuantity < 10 && (
                  <p className="text-sm text-orange-600">
                    {t('products.onlyLeft', { count: product.stockQuantity })}
                  </p>
                )}

                {/* Contact for Inquiry Button */}
                <Button
                  onClick={handleContactInquiry}
                  className="w-full"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Contact for Inquiry
                </Button>
                
                {/* Additional Info */}
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• This is a gallery showcase</p>
                  <p>• Contact us for availability and pricing</p>
                  <p>• Custom orders available</p>
                </div>
              </div>

              {/* Share */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}