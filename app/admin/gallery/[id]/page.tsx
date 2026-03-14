"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import BilingualInput from "@/components/admin/BilingualInput";
import ImageUploader from "@/components/admin/ImageUploader";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Loader2, GripVertical } from "lucide-react";
import Link from "next/link";

type GalleryImage = {
  id: number;
  categoryId: number;
  imagePath: string;
  altTh: string | null;
  altEn: string | null;
  sortOrder: number;
};

type Category = {
  id: number;
  nameTh: string;
  nameEn: string;
  slug: string;
};

export default function GalleryImagesPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload state
  const [altTh, setAltTh] = useState("");
  const [altEn, setAltEn] = useState("");

  // Delete confirmation
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteImage, setDeleteImage] = useState<GalleryImage | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Drag state
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/admin/gallery-categories/${categoryId}/images`,
      );
      const json = await res.json();
      if (json.success) {
        setImages(json.data);
      }
    } catch {
      toast.error("Failed to load images");
    }
  }, [categoryId]);

  const fetchCategory = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/gallery-categories");
      const json = await res.json();
      if (json.success) {
        const cat = json.data.find(
          (c: Category & { imageCount: number }) => c.id === Number(categoryId),
        );
        if (cat) setCategory(cat);
        else router.push("/admin/gallery");
      }
    } catch {
      toast.error("Failed to load category");
    } finally {
      setLoading(false);
    }
  }, [categoryId, router]);

  useEffect(() => {
    fetchCategory();
    fetchImages();
  }, [fetchCategory, fetchImages]);

  async function handleImageUploaded(path: string) {
    try {
      const res = await fetch(
        `/api/admin/gallery-categories/${categoryId}/images`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imagePath: path,
            altTh: altTh || null,
            altEn: altEn || null,
          }),
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to add image");
      toast.success("Image added");
      setAltTh("");
      setAltEn("");
      fetchImages();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add image");
    }
  }

  function openDeleteDialog(image: GalleryImage) {
    setDeleteImage(image);
    setDeleteOpen(true);
  }

  async function handleDelete() {
    if (!deleteImage) return;

    setDeleting(true);
    try {
      const res = await fetch(
        `/api/admin/gallery-categories/${categoryId}/images/${deleteImage.id}`,
        { method: "DELETE" },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete");
      toast.success("Image deleted");
      setDeleteOpen(false);
      setDeleteImage(null);
      fetchImages();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete image");
    } finally {
      setDeleting(false);
    }
  }

  async function handleDragEnd(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;

    const reordered = [...images];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setImages(reordered);

    try {
      const res = await fetch(
        `/api/admin/gallery-categories/${categoryId}/images/reorder`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: reordered.map((img) => img.id) }),
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to reorder");
      toast.success("Order updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to reorder");
      fetchImages(); // revert on error
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/gallery">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold">{category?.nameTh}</h2>
          <p className="text-sm text-muted-foreground">{category?.nameEn}</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Upload New Image</h3>
        <div className="space-y-4">
          <BilingualInput
            label="Alt Text (optional)"
            valueTh={altTh}
            valueEn={altEn}
            onChangeTh={setAltTh}
            onChangeEn={setAltEn}
          />
          <ImageUploader onUploaded={handleImageUploaded} />
        </div>
      </div>

      {/* Images Grid */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">
          Images ({images.length})
        </h3>
        {images.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
            No images yet. Upload one above.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg border bg-white"
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={() => {
                  if (dragIndex !== null && dragIndex !== index) {
                    handleDragEnd(dragIndex, index);
                  }
                  setDragIndex(null);
                }}
                onDragEnd={() => setDragIndex(null)}
              >
                <div className="relative aspect-square">
                  <img
                    src={image.imagePath}
                    alt={image.altTh || image.altEn || "Gallery image"}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />

                  {/* Drag handle */}
                  <div className="absolute left-2 top-2 cursor-grab rounded bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <GripVertical className="h-4 w-4 text-white" />
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => openDeleteDialog(image)}
                    className="absolute right-2 top-2 rounded-full bg-destructive p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </button>
                </div>
                {(image.altTh || image.altEn) && (
                  <div className="border-t p-2">
                    {image.altTh && (
                      <p className="truncate text-xs text-muted-foreground">
                        TH: {image.altTh}
                      </p>
                    )}
                    {image.altEn && (
                      <p className="truncate text-xs text-muted-foreground">
                        EN: {image.altEn}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-sm text-muted-foreground">
            Are you sure you want to delete this image? This action cannot be
            undone.
          </p>
          {deleteImage && (
            <div className="flex justify-center">
              <img
                src={deleteImage.imagePath}
                alt="To be deleted"
                className="h-32 w-auto rounded-lg border object-cover"
              />
            </div>
          )}
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
