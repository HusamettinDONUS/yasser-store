// Single product API endpoints
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Product update schema
const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  category: z.string().min(1).optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  inStock: z.boolean().optional(),
  stockQuantity: z.number().int().min(0).optional(),
  featured: z.boolean().optional()
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Get a single product by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
    const product = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Parse JSON fields
    const formattedProduct = {
      ...product,
      sizes: JSON.parse(product.sizes || '[]'),
      colors: JSON.parse(product.colors || '[]'),
      images: JSON.parse(product.images || '[]')
    };
    
    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

/**
 * Update a product (Admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateProductSchema.parse(body);
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Prepare update data
    const updateData: any = { ...validatedData };
    if (validatedData.sizes) updateData.sizes = JSON.stringify(validatedData.sizes);
    if (validatedData.colors) updateData.colors = JSON.stringify(validatedData.colors);
    if (validatedData.images) updateData.images = JSON.stringify(validatedData.images);
    
    const product = await prisma.product.update({
      where: { id },
      data: updateData
    });
    
    // Format response
    const formattedProduct = {
      ...product,
      sizes: JSON.parse(product.sizes || '[]'),
      colors: JSON.parse(product.colors || '[]'),
      images: JSON.parse(product.images || '[]')
    };
    
    return NextResponse.json({
      message: 'Product updated successfully',
      product: formattedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

/**
 * Delete a product (Admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    await prisma.product.delete({
      where: { id }
    });
    
    return NextResponse.json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}