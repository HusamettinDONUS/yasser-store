// Type definitions for the clothing store application

// Product category enum
export enum ProductCategory {
  SHIRTS = "SHIRTS",
  PANTS = "PANTS",
  DRESSES = "DRESSES",
  JACKETS = "JACKETS",
  SHOES = "SHOES",
  ACCESSORIES = "ACCESSORIES",
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

// File upload types
export interface UploadResult {
  success: boolean;
  error?: string;
  url?: string;
  downloadUrl?: string;
  pathname?: string;
}

export interface UseFileUploadReturn {
  uploading: boolean;
  uploadFile: (file: File) => Promise<UploadResult>;
  uploadMultipleFiles: (files: File[]) => Promise<UploadResult[]>;
}
