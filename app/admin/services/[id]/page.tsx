"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import BilingualInput from "@/components/admin/BilingualInput";
import ImageUploader from "@/components/admin/ImageUploader";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  Save,
  Trash2,
  GripVertical,
} from "lucide-react";
import Link from "next/link";

type ServiceImage = {
  id: number;
  serviceId: number;
  imagePath: string;
  sortOrder: number;
};

type ServiceForm = {
  nameTh: string;
  nameEn: string;
  descriptionTh: string;
  descriptionEn: string;
  seatsTh: string;
  seatsEn: string;
  slug: string;
  active: number;
};

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ServiceForm>({
    nameTh: "",
    nameEn: "",
    descriptionTh: "",
    descriptionEn: "",
    seatsTh: "",
    seatsEn: "",
    slug: "",
    active: 1,
  });
  const [images, setImages] = useState<ServiceImage[]>([]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const fetchService = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/services`);
      const json = await res.json();
      if (!json.success) throw new Error("Failed to fetch");
      const svc = json.data.find((s: { id: number }) => s.id === Number(id));
      if (!svc) {
        toast.error("Service not found");
        router.push("/admin/services");
        return;
      }
      setForm({
        nameTh: svc.nameTh,
        nameEn: svc.nameEn,
        descriptionTh: svc.descriptionTh,
        descriptionEn: svc.descriptionEn,
        seatsTh: svc.seatsTh || "",
        seatsEn: svc.seatsEn || "",
        slug: svc.slug,
        active: svc.active,
      });
    } catch {
      toast.error("Failed to load service");
    }
  }, [id, router]);

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/services/${id}/images`);
      const json = await res.json();
      if (json.success) {
        setImages(json.data);
      }
    } catch {
      toast.error("Failed to load images");
    }
  }, [id]);

  useEffect(() => {
    Promise.all([fetchService(), fetchImages()]).finally(() => setLoading(false));
  }, [fetchService, fetchImages]);

  async function handleSave() {
    if (!form.nameTh || !form.nameEn || !form.descriptionTh || !form.descriptionEn || !form.slug) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("Service updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUploaded(path: string) {
    try {
      const res = await fetch(`/api/admin/services/${id}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath: path }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("Image added");
      fetchImages();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add image");
    }
  }

  async function handleDeleteImage(imageId: number) {
    try {
      const res = await fetch(`/api/admin/services/${id}/images/${imageId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("Image deleted");
      fetchImages();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete image");
    }
  }

  function handleDragStart(index: number) {
    setDragIdx(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIdx === null || dragIdx === index) return;
    const newImages = [...images];
    const [moved] = newImages.splice(dragIdx, 1);
    newImages.splice(index, 0, moved);
    setImages(newImages);
    setDragIdx(index);
  }

  async function handleDragEnd() {
    setDragIdx(null);
    // Save new order
    try {
      const res = await fetch(`/api/admin/services/${id}/images/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: images.map((img) => img.id) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
    } catch {
      toast.error("Failed to save image order");
      fetchImages();
    }
  }

  function toggleActive() {
    setForm((f) => ({ ...f, active: f.active ? 0 : 1 }));
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
      <div className="flex items-center gap-4">
        <Link href="/admin/services" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 w-10 hover:bg-accent hover:text-accent-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold">Edit Service</h2>
          <p className="text-sm text-muted-foreground">
            {form.nameTh} / {form.nameEn}
          </p>
        </div>
      </div>

      {/* Service Details */}
      <Card className="space-y-6 p-6">
        <BilingualInput
          label="Service Name *"
          valueTh={form.nameTh}
          valueEn={form.nameEn}
          onChangeTh={(v) => setForm((f) => ({ ...f, nameTh: v }))}
          onChangeEn={(v) => setForm((f) => ({ ...f, nameEn: v }))}
        />

        <BilingualInput
          label="Description *"
          valueTh={form.descriptionTh}
          valueEn={form.descriptionEn}
          onChangeTh={(v) => setForm((f) => ({ ...f, descriptionTh: v }))}
          onChangeEn={(v) => setForm((f) => ({ ...f, descriptionEn: v }))}
          multiline
        />

        <BilingualInput
          label="Seats"
          valueTh={form.seatsTh}
          valueEn={form.seatsEn}
          onChangeTh={(v) => setForm((f) => ({ ...f, seatsTh: v }))}
          onChangeEn={(v) => setForm((f) => ({ ...f, seatsEn: v }))}
        />

        <div>
          <Label className="text-sm font-semibold">Slug *</Label>
          <Input
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="e.g. airport-transfer"
          />
        </div>

        <div className="flex items-center gap-3">
          <Label className="text-sm font-semibold">Active</Label>
          <Button
            variant={form.active ? "default" : "secondary"}
            size="sm"
            onClick={toggleActive}
          >
            {form.active ? "Active" : "Inactive"}
          </Button>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Image Gallery */}
      <Card className="space-y-4 p-6">
        <h3 className="text-lg font-semibold">Service Images</h3>

        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`group relative rounded-lg border bg-muted/50 transition-opacity ${
                  dragIdx === index ? "opacity-50" : ""
                }`}
              >
                <img
                  src={image.imagePath}
                  alt={`Service image ${index + 1}`}
                  className="aspect-video w-full rounded-t-lg object-cover"
                />
                <div className="flex items-center justify-between p-2">
                  <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <ImageUploader onUploaded={handleImageUploaded} />
      </Card>
    </div>
  );
}
