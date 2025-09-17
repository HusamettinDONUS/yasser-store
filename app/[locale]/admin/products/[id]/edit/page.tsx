"use client";

// Admin product edit page
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { getProductById, updateProduct } from "@/lib/services/products";
import { ProductCategory, ProductSize, Product } from "@/lib/types";
import { useFileUpload } from "@/lib/hooks/useFileUpload";
import { toast } from "sonner";
import Link from "next/link";

// Product update schema
const updateProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.number().positive("Price must be positive"),
  category: z.nativeEnum(ProductCategory),
  stockQuantity: z.number().int().min(0, "Stock quantity must be non-negative"),
  inStock: z.boolean(),
  featured: z.boolean(),
});

type UpdateProductFormData = z.infer<typeof updateProductSchema>;

/**
 * Admin product edit page
 */
export default function EditProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<ProductSize[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");
  const { uploading: uploadingFiles, uploadMultipleFiles } = useFileUpload();

  const router = useRouter();
  const params = useParams();
  const t = useTranslations();
  const locale = useLocale();
  const productId = params.id as string;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateProductFormData>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      inStock: true,
      featured: false,
      stockQuantity: 0,
    },
  });

  const watchedCategory = watch("category");
  const watchedInStock = watch("inStock");
  const watchedFeatured = watch("featured");

  /**
   * Fetch product data
   */
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const fetchedProduct = await getProductById(productId);
      setProduct(fetchedProduct);

      // Populate form
      reset({
        name: fetchedProduct.name,
        description: fetchedProduct.description,
        price: fetchedProduct.price,
        category: fetchedProduct.category as ProductCategory,
        stockQuantity: fetchedProduct.stockQuantity || 0,
        inStock: fetchedProduct.inStock,
        featured: fetchedProduct.featured || false,
      });

      // Set variants and images
      setSelectedSizes(fetchedProduct.sizes || []);
      setSelectedColors(fetchedProduct.colors || []);
      setImageUrls(fetchedProduct.images || []);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
      router.push(`/${locale}/admin/products`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle form submission
   */
  const onSubmit = async (data: UpdateProductFormData) => {
    try {
      setSaving(true);

      const productData = {
        ...data,
        sizes: selectedSizes,
        colors: selectedColors,
        images: imageUrls,
      };

      await updateProduct(productId, productData);
      toast.success("Product updated successfully");
      router.push(`/${locale}/admin/products`);
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error(error.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle size selection
   */
  const toggleSize = (size: ProductSize) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  /**
   * Add color
   */
  const addColor = () => {
    if (colorInput.trim() && !selectedColors.includes(colorInput.trim())) {
      setSelectedColors((prev) => [...prev, colorInput.trim()]);
      setColorInput("");
    }
  };

  /**
   * Remove color
   */
  const removeColor = (color: string) => {
    setSelectedColors((prev) => prev.filter((c) => c !== color));
  };

  /**
   * Add image URL
   */
  const addImageUrl = () => {
    if (imageInput.trim() && !imageUrls.includes(imageInput.trim())) {
      setImageUrls((prev) => [...prev, imageInput.trim()]);
      setImageInput("");
    }
  };

  /**
   * Handle file upload
   */
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const results = await uploadMultipleFiles(fileArray);

    const successfulUploads = results
      .filter((result) => result.success && result.url)
      .map((result) => result.url!);

    if (successfulUploads.length > 0) {
      setImageUrls((prev) => [...prev, ...successfulUploads]);
    }

    // Reset file input
    event.target.value = "";
  };

  /**
   * Remove image URL
   */
  const removeImageUrl = (url: string) => {
    setImageUrls((prev) => prev.filter((u) => u !== url));
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const availableSizes = Object.values(ProductSize);
  const availableCategories = Object.values(ProductCategory);

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading product...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Product not found</h2>
            <Button asChild>
              <Link href={`/${locale}/admin/products`}>Back to Products</Link>
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center space-x-4">
          <Link href={`/${locale}/admin/products`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <p className="text-muted-foreground">
              Update "{product.name}" details
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Product Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Essential product details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Enter product name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Product Description</Label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      placeholder="Enter product description"
                      rows={4}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Product Price</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        {...register("price", { valueAsNumber: true })}
                        placeholder="0.00"
                        className={errors.price ? "border-red-500" : ""}
                      />
                      {errors.price && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.price.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="category">Product Category</Label>
                      <Select
                        value={watchedCategory}
                        onValueChange={(value) =>
                          setValue("category", value as ProductCategory)
                        }
                      >
                        <SelectTrigger
                          className={errors.category ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category.charAt(0).toUpperCase() +
                                category.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.category.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Variants */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Variants</CardTitle>
                  <CardDescription>
                    Sizes, colors, and other options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Sizes */}
                  <div>
                    <Label>Available Sizes</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {availableSizes.map((size) => (
                        <Button
                          key={size}
                          type="button"
                          variant={
                            selectedSizes.includes(size) ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => toggleSize(size)}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <Label>Available Colors</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={colorInput}
                        onChange={(e) => setColorInput(e.target.value)}
                        placeholder="Enter color name"
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addColor())
                        }
                      />
                      <Button type="button" onClick={addColor}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedColors.map((color) => (
                        <Badge
                          key={color}
                          variant="secondary"
                          className="gap-1"
                        >
                          {color}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeColor(color)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                  <CardDescription>Upload images or add URLs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* File Upload */}
                  <div>
                    <Label htmlFor="file-upload">Upload Images</Label>
                    <div className="mt-2">
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploadingFiles}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 disabled:opacity-50"
                      />
                      {uploadingFiles && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Uploading files...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* URL Input */}
                  <div>
                    <Label>Or Add Image URL</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={imageInput}
                        onChange={(e) => setImageInput(e.target.value)}
                        placeholder="Enter image URL"
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addImageUrl())
                        }
                      />
                      <Button type="button" onClick={addImageUrl}>
                        <Upload className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImageUrl(url)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Inventory */}
              <Card>
                <CardHeader>
                  <CardTitle>Inventory</CardTitle>
                  <CardDescription>Stock and availability</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="stockQuantity">Stock Quantity</Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      {...register("stockQuantity", { valueAsNumber: true })}
                      placeholder="0"
                      className={errors.stockQuantity ? "border-red-500" : ""}
                    />
                    {errors.stockQuantity && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.stockQuantity.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="inStock">In Stock</Label>
                    <Switch
                      id="inStock"
                      checked={watchedInStock}
                      onCheckedChange={(checked) =>
                        setValue("inStock", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured">Featured Product</Label>
                    <Switch
                      id="featured"
                      checked={watchedFeatured}
                      onCheckedChange={(checked) =>
                        setValue("featured", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button type="submit" className="w-full" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Product"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <Link href={`/${locale}/admin/products`}>Cancel</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
