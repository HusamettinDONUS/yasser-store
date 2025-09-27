import { useState } from "react";
import { toast } from "sonner";
import { UseFileUploadReturn, UploadResult } from "@/lib/types";

export function useFileUpload(): UseFileUploadReturn {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File): Promise<UploadResult> => {
    try {
      setUploading(true);

      // Validate file
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        const error = "Invalid file type. Only images are allowed.";
        toast.error(error);
        return { success: false, error };
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        const error = "File size too large. Maximum size is 5MB.";
        toast.error(error);
        return { success: false, error };
      }

      // Create FormData
      const formData = new FormData();
      formData.append("file", file);

      // Upload file
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Upload failed");
        return { success: false, error: result.error };
      }

      toast.success("File uploaded successfully");
      return {
        success: true,
        url: result.url,
        downloadUrl: result.downloadUrl,
        pathname: result.pathname,
      };
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = "Failed to upload file";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUploading(false);
    }
  };

  /**
   * Upload multiple files
   */
  const uploadMultipleFiles = async (
    files: File[]
  ): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];

    for (const file of files) {
      const result = await uploadFile(file);
      results.push(result);

      // Small delay between uploads to avoid overwhelming the server
      if (files.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    return results;
  };

  return {
    uploading,
    uploadFile,
    uploadMultipleFiles,
  };
}
