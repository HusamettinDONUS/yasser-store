// File upload API endpoint using local filesystem
import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { requireAdmin } from "@/lib/auth";

/**
 * Handle file upload to local filesystem
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    // Get file data from request
    const body = await request.blob();

    if (!body || body.size === 0) {
      return NextResponse.json(
        { error: "No file data provided" },
        { status: 400 }
      );
    }

    // Validate file type (images only)
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(body.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (body.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}-${filename}`;

    // Convert blob to buffer
    const bytes = await body.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create file path
    const filePath = join(
      process.cwd(),
      "public",
      "uploads",
      "products",
      uniqueFilename
    );

    // Write file to local filesystem
    await writeFile(filePath, buffer);

    // Generate public URL
    const publicUrl = `/uploads/products/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFilename,
      size: body.size,
      type: body.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

/**
 * Handle file deletion from local filesystem
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "File URL is required" },
        { status: 400 }
      );
    }

    // Extract filename from URL
    const filename = url.split("/").pop();
    if (!filename) {
      return NextResponse.json({ error: "Invalid file URL" }, { status: 400 });
    }

    // Create file path
    const filePath = join(
      process.cwd(),
      "public",
      "uploads",
      "products",
      filename
    );

    // Delete file from local filesystem
    try {
      await unlink(filePath);
    } catch (error) {
      // File might not exist, which is fine
      console.log("File not found or already deleted:", filename);
    }

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
