// Products API endpoints
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Product creation schema
const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.number().positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  sizes: z.array(z.string()).optional().default([]),
  colors: z.array(z.string()).optional().default([]),
  images: z.array(z.string()).optional().default([]),
  inStock: z.boolean().default(true),
  stockQuantity: z.number().int().min(0).default(0),
  featured: z.boolean().default(false),
});

/**
 * Get all products with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured") === "true";
    const inStock = searchParams.get("inStock") === "true";
    const limit = searchParams.get("limit");

    const where: Record<string, unknown> = {};

    if (category) where.category = category;
    if (featured) where.featured = true;
    if (inStock) where.inStock = true;

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit ? parseInt(limit) : undefined,
    });

    // Parse JSON fields
    const formattedProducts = products.map((product) => ({
      ...product,
      sizes: JSON.parse(product.sizes || "[]"),
      colors: JSON.parse(product.colors || "[]"),
      images: JSON.parse(product.images || "[]"),
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/**
 * Create a new product (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    await requireAdmin();

    const body = await request.json();
    const validatedData = createProductSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        ...validatedData,
        sizes: JSON.stringify(validatedData.sizes),
        colors: JSON.stringify(validatedData.colors),
        images: JSON.stringify(validatedData.images),
      },
    });

    // Format response
    const formattedProduct = {
      ...product,
      sizes: JSON.parse(product.sizes || "[]"),
      colors: JSON.parse(product.colors || "[]"),
      images: JSON.parse(product.images || "[]"),
    };

    return NextResponse.json(
      {
        message: "Product created successfully",
        product: formattedProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
