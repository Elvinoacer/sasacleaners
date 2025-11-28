"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  maxFiles?: number;
}

export default function ImageUpload({
  value,
  onChange,
  disabled,
  maxFiles = 1,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed maxFiles limit
    const remainingSlots = maxFiles - value.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    if (filesToUpload.length === 0) {
      alert(`Maximum ${maxFiles} file(s) allowed`);
      return;
    }

    setIsUploading(true);
    const newUrls: string[] = [];

    try {
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          alert(`File "${file.name}" is too large. Maximum size is 5MB.`);
          continue;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
          alert(`File "${file.name}" is not an image.`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "portfolio");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();
        newUrls.push(data.url);
      }

      if (newUrls.length > 0) {
        onChange([...value, ...newUrls]);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove));
  };

  const remainingFiles = maxFiles - value.length;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Uploaded Images Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          {value.map((url, index) => (
            <div
              key={url}
              className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden border border-white/10 bg-slate-800/20 group"
            >
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute top-1 right-1 sm:top-2 sm:right-2 z-20 bg-red-500 text-white p-1 sm:p-1.5 rounded-full hover:bg-red-600 transition-all transform hover:scale-110"
                aria-label="Remove image"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              {/* Image Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  Click to remove
                </span>
              </div>

              {/* Image */}
              <Image
                fill
                className="object-cover"
                alt={`Uploaded image ${index + 1}`}
                src={url}
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {remainingFiles > 0 && (
        <div className="space-y-2 sm:space-y-3">
          {/* File Input */}
          <input
            type="file"
            accept="image/*"
            multiple={maxFiles > 1}
            className="hidden"
            ref={fileInputRef}
            onChange={handleUpload}
            disabled={disabled || isUploading}
          />

          {/* Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="w-full flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-4 sm:px-6 bg-slate-950/50 border-2 border-dashed border-white/20 rounded-lg sm:rounded-xl text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span className="text-sm sm:text-base">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
                <span className="text-sm sm:text-base">
                  Upload Image
                  {maxFiles > 1 ? `s (${remainingFiles} remaining)` : ""}
                </span>
              </>
            )}
          </button>

          {/* Help Text */}
          <div className="text-xs sm:text-sm text-slate-500 text-center">
            <p>Supported formats: JPG, PNG, WebP</p>
            <p>Maximum file size: 5MB</p>
            {maxFiles > 1 && (
              <p>
                Maximum {maxFiles} image{maxFiles !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Max Files Reached Message */}
      {remainingFiles === 0 && (
        <div className="text-center py-3 sm:py-4 bg-slate-800/20 rounded-lg sm:rounded-xl border border-white/10">
          <p className="text-sm sm:text-base text-slate-400">
            Maximum {maxFiles} image{maxFiles !== 1 ? "s" : ""} reached
          </p>
        </div>
      )}

      {/* Empty State */}
      {value.length === 0 && !isUploading && remainingFiles > 0 && (
        <div className="text-center py-6 sm:py-8 bg-slate-800/10 rounded-lg sm:rounded-xl border border-dashed border-white/10">
          <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-slate-600 mx-auto mb-2 sm:mb-3" />
          <p className="text-sm sm:text-base text-slate-500 mb-1">
            No images uploaded yet
          </p>
          <p className="text-xs sm:text-sm text-slate-600">
            Upload your first image to get started
          </p>
        </div>
      )}
    </div>
  );
}
