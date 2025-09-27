"use client";

// Admin layout component with authentication protection
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "../layout/Header";

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Admin layout component with sidebar navigation
 */
export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const locale = useLocale();

  /**
   * Redirect if not admin
   */
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push(`/${locale}/auth/signin`);
    }
  }, [user, isAdmin, loading, router, locale]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render if not admin
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Page content */}
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
}
