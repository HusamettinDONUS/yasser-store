"use client";

// Admin new product creation page
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Upload, X } from "lucide-react";
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
import { createProduct } from "@/lib/services/products";
import { ProductCategory, ProductSize } from "@/lib/types";
import { useFileUpload } from "@/lib/hooks/useFileUpload";
import { toast } from "sonner";
import Link from "next/link";

// Product creation schema
const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.number().positive("Price must be positive"),
  category: z.nativeEnum(ProductCategory),
  stockQuantity: z.number().int().min(0, "Stock quantity must be non-negative"),
  inStock: z.boolean(),
  featured: z.boolean(),
});

type CreateProductFormData = z.infer<typeof createProductSchema>;

/**
 * Admin new product creation page
 */
export default function NewProductPage() {
  const [loading, setLoading] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<ProductSize[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");
  const { uploading: uploadingFiles, uploadMultipleFiles } = useFileUpload();

  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
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
   * Handle form submission
   */
  const onSubmit = async (data: CreateProductFormData) => {
    try {
      setLoading(true);

      const productData = {
        ...data,
        sizes: selectedSizes,
        colors: selectedColors,
        images: imageUrls,
      };

      await createProduct(productData);
      toast.success(t("admin.productSaved"));
      router.push(`/${locale}/admin/products`);
    } catch (error: unknown) {
      console.error("Error creating product:", error);
      toast.error((error as Error)?.message || t("common.error"));
    } finally {
      setLoading(false);
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

  const availableSizes = Object.values(ProductSize);
  const availableCategories = Object.values(ProductCategory);

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
            <h1 className="text-3xl font-bold">{t("admin.addProduct")}</h1>
            <p className="text-muted-foreground">{t("admin.createProduct")}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Product Info */}
            <div className="xl:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.basicInformation")}</CardTitle>
                  <CardDescription>
                    {t("admin.essentialDetails")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">{t("admin.productName")}</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder={t("admin.productName")}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">
                      {t("admin.productDescription")}
                    </Label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      placeholder={t("admin.productDescription")}
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
                      <Label htmlFor="price">{t("admin.productPrice")}</Label>
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
                      <Label htmlFor="category">
                        {t("admin.productCategory")}
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setValue("category", value as ProductCategory)
                        }
                      >
                        <SelectTrigger
                          className={errors.category ? "border-red-500" : ""}
                        >
                          <SelectValue
                            placeholder={t("admin.selectCategory")}
                          />
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
                  <CardTitle>{t("admin.productVariants")}</CardTitle>
                  <CardDescription>
                    {t("admin.sizesColorsOptions")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Sizes */}
                  <div>
                    <Label>{t("admin.availableSizes")}</Label>
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
                    <Label>{t("admin.availableColors")}</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={colorInput}
                        onChange={(e) => setColorInput(e.target.value)}
                        placeholder={t("admin.enterColorName")}
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addColor())
                        }
                      />
                      <Button type="button" onClick={addColor}>
                        {t("common.add")}
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
                  <CardTitle>{t("admin.productImages")}</CardTitle>
                  <CardDescription>{t("admin.uploadImages")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* File Upload */}
                  <div>
                    <Label htmlFor="file-upload">
                      {t("admin.uploadImagesLabel")}
                    </Label>
                    <div className="mt-2">
                      <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                        <div className="space-y-2">
                          <div className="mx-auto h-12 w-12 text-muted-foreground">
                            <Upload className="h-full w-full" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              {t("admin.dragDropImages")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {t("admin.maxFileSize")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {t("admin.supportedFormats")}
                            </p>
                          </div>
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={uploadingFiles}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                      </div>
                      {uploadingFiles && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("admin.uploadingFiles")}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* URL Input */}
                  <div>
                    <Label>{t("admin.addImageUrl")}</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={imageInput}
                        onChange={(e) => setImageInput(e.target.value)}
                        placeholder={t("admin.enterImageUrl")}
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addImageUrl())
                        }
                      />
                      <Button type="button" onClick={addImageUrl}>
                        <Upload className="h-4 w-4 mr-2" />
                        {t("common.add")}
                      </Button>
                    </div>
                  </div>

                  {imageUrls.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        {t("admin.uploadedImages")}
                      </Label>
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
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Inventory */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("admin.inventory")}</CardTitle>
                  <CardDescription>
                    {t("admin.stockAvailability")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="stockQuantity">
                      {t("admin.stockQuantity")}
                    </Label>
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
                    <Label htmlFor="inStock">{t("admin.inStock")}</Label>
                    <Switch
                      id="inStock"
                      checked={watchedInStock}
                      onCheckedChange={(checked) =>
                        setValue("inStock", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured">
                      {t("admin.featuredProduct")}
                    </Label>
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
                  <CardTitle>{t("admin.actions")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading
                      ? t("admin.creating")
                      : t("admin.createProductBtn")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <Link href={`/${locale}/admin/products`}>
                      {t("common.cancel")}
                    </Link>
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
