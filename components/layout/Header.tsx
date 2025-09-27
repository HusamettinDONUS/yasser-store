"use client";

// Header navigation component for the storefront
import React, { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Main header navigation component
 */
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const t = useTranslations();
  const locale = useLocale();

  /**
   * Navigation links for categories
   */
  const categoryLinks = [
    {
      href: `/${locale}/products?category=shirts`,
      label: t("categories.shirts.name"),
    },
    {
      href: `/${locale}/products?category=pants`,
      label: t("categories.pants.name"),
    },
    {
      href: `/${locale}/products?category=dresses`,
      label: t("categories.dresses.name"),
    },
    {
      href: `/${locale}/products?category=jackets`,
      label: t("categories.jackets.name"),
    },
    {
      href: `/${locale}/products?category=shoes`,
      label: t("categories.shoes.name"),
    },
    {
      href: `/${locale}/products?category=accessories`,
      label: t("categories.accessories.name"),
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center space-x-2 rtl:space-x-reverse rtl:flex-row-reverse"
          >
            <ShoppingBag className="h-6 w-6" />
            <span className="text-xl font-bold">Yasser Store</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            <Link
              href={`/${locale}`}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("common.home")}
            </Link>
            <Link
              href={`/${locale}/products`}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("navigation.allProducts")}
            </Link>

            {/* Category Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium">
                  {t("common.categories")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categoryLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href}>{link.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* User Menu */}
            {user && <Link href={`/${locale}/admin`}>{t("common.admin")}</Link>}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href={`/${locale}`}
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("common.home")}
              </Link>
              <Link
                href={`/${locale}/products`}
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("navigation.allProducts")}
              </Link>

              {/* Mobile Categories */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {t("common.categories")}
                </p>
                {categoryLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm pl-4 rtl:pl-0 rtl:pr-4 hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
