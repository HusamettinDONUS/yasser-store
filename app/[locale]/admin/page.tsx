"use client";

// Admin dashboard page component
import React, { useEffect, useState, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllProducts } from "@/lib/services/products";
import { Product } from "@/lib/types";
import { toast } from "sonner";
import Link from "next/link";

/**
 * Admin dashboard page component
 */
export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();
  const t = useTranslations();

  /**
   * Fetch dashboard data
   */
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedProducts = await getAllProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error(t("admin.loadingError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  /**
   * Calculate dashboard statistics
   */
  const getStatistics = () => {
    const totalProducts = products.length;
    const inStockProducts = products.filter((p) => p.inStock).length;
    const outOfStockProducts = totalProducts - inStockProducts;
    const featuredProducts = products.filter((p) => p.featured).length;
    const totalValue = products.reduce(
      (sum, p) => sum + p.price * (p.stockQuantity || 0),
      0
    );
    const averagePrice =
      totalProducts > 0
        ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts
        : 0;

    return {
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      featuredProducts,
      totalValue,
      averagePrice,
    };
  };

  /**
   * Get recent products (last 5)
   */
  const getRecentProducts = () => {
    return products
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  };

  /**
   * Format currency
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = getStatistics();
  const recentProducts = getRecentProducts();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{t("admin.dashboard")}</h1>
          <p className="text-muted-foreground">{t("admin.welcomeMessage")}</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 rtl:flex-row-reverse">
              <CardTitle className="text-sm font-medium">
                {t("admin.totalProducts")}
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.featuredProducts} {t("admin.featured")}
              </p>
            </CardContent>
          </Card>

          {/* In Stock */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 rtl:flex-row-reverse">
              <CardTitle className="text-sm font-medium">
                {t("admin.inStock")}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.inStockProducts}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.outOfStockProducts} {t("admin.outOfStock")}
              </p>
            </CardContent>
          </Card>

          {/* Total Value */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 rtl:flex-row-reverse">
              <CardTitle className="text-sm font-medium">
                {t("admin.inventoryValue")}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalValue)}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("admin.average")}: {formatCurrency(stats.averagePrice)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Products */}
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.recentProducts")}</CardTitle>
              <CardDescription>{t("admin.latestProductsDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : recentProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t("admin.noProductsFound")}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 border rounded-lg rtl:flex-row-reverse"
                    >
                      <div className="flex-1 rtl:text-right">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(product.price)} • {product.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 rtl:flex-row-reverse">
                        {product.featured && (
                          <Badge variant="secondary" className="text-xs">
                            {t("admin.featured")}
                          </Badge>
                        )}
                        {!product.inStock && (
                          <Badge variant="destructive" className="text-xs">
                            {t("admin.outOfStock")}
                          </Badge>
                        )}
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.quickActions")}</CardTitle>
              <CardDescription>{t("admin.commonTasks")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <Button
                  className="justify-start rtl:justify-end rtl:flex-row-reverse"
                  asChild
                >
                  <Link href={`/${locale}/admin/products/new`}>
                    <Package className="mr-2 rtl:mr-0 rtl:ml-2 h-4 w-4" />
                    {t("admin.addNewProduct")}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start rtl:justify-end rtl:flex-row-reverse"
                  asChild
                >
                  <Link href={`/${locale}/admin/products`}>
                    <Eye className="mr-2 rtl:mr-0 rtl:ml-2 h-4 w-4" />
                    {t("admin.viewAllProducts")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {!loading && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 rtl:flex-row-reverse">
                <TrendingDown className="h-5 w-5 text-orange-500" />
                {t("admin.lowStockAlert")}
              </CardTitle>
              <CardDescription>
                {t("admin.productsNeedRestock")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const lowStockProducts = products.filter(
                  (p) => p.inStock && (p.stockQuantity || 0) < 10
                );

                if (lowStockProducts.length === 0) {
                  return (
                    <p className="text-muted-foreground">
                      {t("admin.allProductsWellStocked")}
                    </p>
                  );
                }

                return (
                  <div className="space-y-2">
                    {lowStockProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-950 rounded rtl:flex-row-reverse"
                      >
                        <span className="font-medium">{product.name}</span>
                        <Badge variant="outline" className="text-orange-600">
                          {product.stockQuantity} {t("admin.leftInStock")}
                        </Badge>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
