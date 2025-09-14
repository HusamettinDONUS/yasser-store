// Product service for Firebase Firestore operations
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Product, ProductFormData, FilterOptions, ProductCategory } from '../types';

const PRODUCTS_COLLECTION = 'products';

/**
 * Get all products from Firestore
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Product[];
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
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    let q = query(productsRef, orderBy('createdAt', 'desc'));
    
    // Apply filters
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    
    if (filters.inStock !== undefined) {
      q = query(q, where('inStock', '==', filters.inStock));
    }
    
    if (filters.featured !== undefined) {
      q = query(q, where('featured', '==', filters.featured));
    }
    
    const snapshot = await getDocs(q);
    let products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Product[];
    
    // Apply client-side filters for complex queries
    if (filters.minPrice !== undefined) {
      products = products.filter(p => p.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice !== undefined) {
      products = products.filter(p => p.price <= filters.maxPrice!);
    }
    
    if (filters.sizes && filters.sizes.length > 0) {
      products = products.filter(p => 
        p.sizes.some(size => filters.sizes!.includes(size))
      );
    }
    
    if (filters.colors && filters.colors.length > 0) {
      products = products.filter(p => 
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
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as Product;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product');
  }
}

/**
 * Upload product images to Firebase Storage
 */
export async function uploadProductImages(images: File[], productId: string): Promise<string[]> {
  try {
    const uploadPromises = images.map(async (image, index) => {
      const imageRef = ref(storage, `products/${productId}/image_${index}_${Date.now()}`);
      const snapshot = await uploadBytes(imageRef, image);
      return await getDownloadURL(snapshot.ref);
    });
    
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading images:', error);
    throw new Error('Failed to upload images');
  }
}

/**
 * Create a new product
 */
export async function createProduct(productData: ProductFormData): Promise<string> {
  try {
    const now = Timestamp.now();
    
    // First create the product document to get an ID
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category: productData.category,
      sizes: productData.sizes,
      colors: productData.colors,
      images: [], // Will be updated after image upload
      inStock: productData.inStock,
      stockQuantity: productData.stockQuantity,
      featured: productData.featured,
      createdAt: now,
      updatedAt: now
    });
    
    // Upload images if provided
    let imageUrls: string[] = [];
    if (productData.images && productData.images.length > 0) {
      imageUrls = await uploadProductImages(productData.images, docRef.id);
      
      // Update the product with image URLs
      await updateDoc(docRef, {
        images: imageUrls,
        updatedAt: Timestamp.now()
      });
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(id: string, productData: Partial<ProductFormData>): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    
    // Handle image upload if new images are provided
    let updateData: any = {
      ...productData,
      updatedAt: Timestamp.now()
    };
    
    if (productData.images && productData.images.length > 0) {
      const imageUrls = await uploadProductImages(productData.images, id);
      updateData.images = imageUrls;
    }
    
    // Remove the images field if it's a File array
    if (updateData.images && updateData.images[0] instanceof File) {
      delete updateData.images;
    }
    
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<void> {
  try {
    // First get the product to access image URLs
    const product = await getProductById(id);
    
    // Delete images from storage
    if (product && product.images.length > 0) {
      const deletePromises = product.images.map(async (imageUrl) => {
        try {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        } catch (error) {
          console.warn('Failed to delete image:', imageUrl, error);
        }
      });
      
      await Promise.all(deletePromises);
    }
    
    // Delete the product document
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limitCount: number = 8): Promise<Product[]> {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsRef, 
      where('featured', '==', true),
      where('inStock', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Product[];
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
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsRef,
      where('category', '==', category),
      where('inStock', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Product[];
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw new Error('Failed to fetch products by category');
  }
}