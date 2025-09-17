"use client";

// Footer component for the website
import React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import {
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Footer component
 */
export function Footer() {
  const t = useTranslations();
  const locale = useLocale();

  /**
   * Handle newsletter subscription
   */
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log("Newsletter subscription submitted");
  };

  return (
    <footer className="bg-slate-900 text-slate-100">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <Link
                href={`/${locale}`}
                className="flex items-center space-x-2 rtl:space-x-reverse rtl:flex-row-reverse"
              >
                <ShoppingBag className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Yasser Store</span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t("footer.description")}
              </p>

              {/* Social Links */}
              <div className="flex space-x-4 rtl:space-x-reverse">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-slate-400 hover:text-primary"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-slate-400 hover:text-primary"
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-slate-400 hover:text-primary"
                >
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-slate-400 hover:text-primary"
                >
                  <Youtube className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {t("footer.quickLinks")}
              </h3>
              <nav className="flex flex-col space-y-2">
                <Link
                  href={`/${locale}`}
                  className="text-slate-400 hover:text-primary transition-colors text-sm"
                >
                  {t("common.home")}
                </Link>
                <Link
                  href={`/${locale}/products`}
                  className="text-slate-400 hover:text-primary transition-colors text-sm"
                >
                  {t("navigation.allProducts")}
                </Link>
                <Link
                  href={`/${locale}/products?featured=true`}
                  className="text-slate-400 hover:text-primary transition-colors text-sm"
                >
                  {t("navigation.featured")}
                </Link>
                <Link
                  href={`/${locale}/about`}
                  className="text-slate-400 hover:text-primary transition-colors text-sm"
                >
                  {t("navigation.about")}
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  className="text-slate-400 hover:text-primary transition-colors text-sm"
                >
                  {t("navigation.contact")}
                </Link>
              </nav>
            </div>

            {/* Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {t("common.categories")}
              </h3>
              <nav className="flex flex-col space-y-2">
                <Link
                  href={`/${locale}/products?category=shirts`}
                  className="text-slate-400 hover:text-primary transition-colors text-sm"
                >
                  {t("categories.shirts.name")}
                </Link>
                <Link
                  href={`/${locale}/products?category=pants`}
                  className="text-slate-400 hover:text-primary transition-colors text-sm"
                >
                  {t("categories.pants.name")}
                </Link>
                <Link
                  href={`/${locale}/products?category=dresses`}
                  className="text-slate-400 hover:text-primary transition-colors text-sm"
                >
                  {t("categories.dresses.name")}
                </Link>
                <Link
                  href={`/${locale}/products?category=accessories`}
                  className="text-slate-400 hover:text-primary transition-colors text-sm"
                >
                  {t("categories.accessories.name")}
                </Link>
              </nav>
            </div>

            {/* Contact & Newsletter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {t("footer.stayConnected")}
              </h3>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm text-slate-400">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>info@yasserstore.com</span>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm text-slate-400">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm text-slate-400">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>123 Fashion St, Style City</span>
                </div>
              </div>

              {/* Newsletter */}
              <div className="space-y-2">
                <p className="text-sm text-slate-400">
                  {t("footer.newsletter")}
                </p>
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="flex space-x-2 rtl:space-x-reverse"
                >
                  <Input
                    type="email"
                    placeholder={t("footer.enterEmail")}
                    className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400"
                    required
                  />
                  <Button type="submit" size="sm">
                    {t("footer.subscribe")}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-slate-400">
              {t("footer.copyright", { year: new Date().getFullYear() })}
            </div>

            <div className="flex space-x-6 rtl:space-x-reverse text-sm">
              <Link
                href={`/${locale}/privacy`}
                className="text-slate-400 hover:text-primary transition-colors"
              >
                {t("footer.privacy")}
              </Link>
              <Link
                href={`/${locale}/terms`}
                className="text-slate-400 hover:text-primary transition-colors"
              >
                {t("footer.terms")}
              </Link>
              <Link
                href={`/${locale}/shipping`}
                className="text-slate-400 hover:text-primary transition-colors"
              >
                {t("footer.shipping")}
              </Link>
              <Link
                href={`/${locale}/returns`}
                className="text-slate-400 hover:text-primary transition-colors"
              >
                {t("footer.returns")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
