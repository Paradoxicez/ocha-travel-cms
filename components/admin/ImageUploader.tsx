"use client";

import { useState, useCallback } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onUploaded: (path: string) => void;
  currentImage?: string | null;
  onRemove?: () => void;
};

export default function ImageUploader({ onUploaded, currentImage, onRemove }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Upload failed");
        onUploaded(json.data.path);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onUploaded],
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
  }

  return (
    <div className="space-y-2">
      {currentImage && (
        <div className="relative inline-block">
          <img
            src={currentImage}
            alt="Current"
            className="h-32 w-auto rounded-lg border object-cover"
          />
          {onRemove && (
            <button
              onClick={onRemove}
              className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
      >
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        ) : (
          <>
            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              ลากไฟล์มาวาง หรือ{" "}
              <label className="cursor-pointer font-medium text-primary underline">
                เลือกไฟล์
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, WebP (สูงสุด 5MB)
            </p>
          </>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
