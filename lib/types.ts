// Type definitions for the clothing store application

// Product category enum
export enum ProductCategory {
  SHIRTS = "shirts",
  PANTS = "pants",
  DRESSES = "dresses",
  JACKETS = "jackets",
  SHOES = "shoes",
  ACCESSORIES = "accessories",
}

// Product size enum
export enum ProductSize {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
}

// Product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  sizes: ProductSize[];
  colors: string[];
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Product form data interface (for admin panel)
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  sizes: ProductSize[];
  colors: string[];
  images: File[];
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
}

// User interface
export interface User {
  id: string;
  email: string;
  displayName?: string;
  isAdmin: boolean;
  createdAt: Date;
}

// Note: Cart and Order interfaces removed - this is a showcase website only

// Filter options interface
export interface FilterOptions {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  sizes?: ProductSize[];
  colors?: string[];
  inStock?: boolean;
  featured?: boolean;
}
