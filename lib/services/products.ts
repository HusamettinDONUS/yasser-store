// Product service for Next.js API endpoints
import { Product, FilterOptions, ProductCategory } from '../types';

/**
 * Get all products from API
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

/**
 * Get products with filters
 */
export async function getFilteredProducts(filters: FilterOptions): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters.inStock !== undefined) params.append('inStock', filters.inStock.toString());
    
    const response = await fetch(`/api/products?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch filtered products');
    }
    
    let products = await response.json();
    
    // Apply client-side filters for complex queries
    if (filters.minPrice !== undefined) {
      products = products.filter((p: Product) => p.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice !== undefined) {
      products = products.filter((p: Product) => p.price <= filters.maxPrice!);
    }
    
    if (filters.sizes && filters.sizes.length > 0) {
      products = products.filter((p: Product) => 
        p.sizes.some(size => filters.sizes!.includes(size))
      );
    }
    
    if (filters.colors && filters.colors.length > 0) {
      products = products.filter((p: Product) => 
        p.colors.some(color => filters.colors!.includes(color))
      );
    }
    
    return products;
  } catch (error) {
    console.error('Error fetching filtered products:', error);
    throw new Error('Failed to fetch filtered products');
  }
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`/api/products/${id}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product');
  }
}

/**
 * Create a new product (Admin only)
 */
export async function createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create product');
    }
    
    const result = await response.json();
    return result.product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

/**
 * Update an existing product (Admin only)
 */
export async function updateProduct(id: string, productData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product> {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update product');
    }
    
    const result = await response.json();
    return result.product;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

/**
 * Delete a product (Admin only)
 */
export async function deleteProduct(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete product');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limitCount: number = 8): Promise<Product[]> {
  try {
    const response = await fetch(`/api/products?featured=true&limit=${limitCount}`);
    if (!response.ok) {
      throw new Error('Failed to fetch featured products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw new Error('Failed to fetch featured products');
  }
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
  try {
    const response = await fetch(`/api/products?category=${category}&inStock=true`);
    if (!response.ok) {
      throw new Error('Failed to fetch products by category');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw new Error('Failed to fetch products by category');
  }
}