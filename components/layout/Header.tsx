'use client';

// Header navigation component for the storefront
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { ShoppingBag, Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from 'next-auth/react';
import { ProductCategory } from '@/lib/types';
import { toast } from 'sonner';

interface HeaderProps {
  // Gallery-focused header - no cart functionality
}

/**
 * Main header navigation component
 */
export function Header({}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();

  /**
   * Handle user sign out
   */
  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      toast.success(t('auth.signOutSuccess'));
      router.push(`/${locale}`);
    } catch (error) {
      toast.error(t('auth.signOutError'));
    }
  };

  /**
   * Navigation links for categories
   */
  const categoryLinks = [
    { href: `/${locale}/products?category=shirts`, label: t('categories.shirts.name') },
    { href: `/${locale}/products?category=pants`, label: t('categories.pants.name') },
    { href: `/${locale}/products?category=dresses`, label: t('categories.dresses.name') },
    { href: `/${locale}/products?category=jackets`, label: t('categories.jackets.name') },
    { href: `/${locale}/products?category=shoes`, label: t('categories.shoes.name') },
    { href: `/${locale}/products?category=accessories`, label: t('categories.accessories.name') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6" />
            <span className="text-xl font-bold">Yasser Store</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href={`/${locale}`} className="text-sm font-medium hover:text-primary transition-colors">
              {t('common.home')}
            </Link>
            <Link href={`/${locale}/products`} className="text-sm font-medium hover:text-primary transition-colors">
              {t('navigation.allProducts')}
            </Link>
            
            {/* Category Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium">
                  {t('common.categories')}
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
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    {user.displayName || user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/profile`}>{t('common.profile')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/orders`}>{t('common.orders')}</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/${locale}/admin`}>{t('common.admin')}</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('common.signout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href={`/${locale}/auth/signin`}>{t('common.signin')}</Link>
                </Button>
                <Button asChild>
                  <Link href={`/${locale}/auth/signup`}>{t('common.signup')}</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
                {t('common.home')}
              </Link>
              <Link 
                href={`/${locale}/products`} 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('navigation.allProducts')}
              </Link>
              
              {/* Mobile Categories */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{t('common.categories')}</p>
                {categoryLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm pl-4 hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Auth */}
              {!user && (
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Button variant="ghost" asChild>
                    <Link href={`/${locale}/auth/signin`} onClick={() => setIsMobileMenuOpen(false)}>
                      {t('common.signin')}
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/${locale}/auth/signup`} onClick={() => setIsMobileMenuOpen(false)}>
                      {t('common.signup')}
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}