"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import BilingualInput from "@/components/admin/BilingualInput";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

type Service = {
  id: number;
  nameTh: string;
  nameEn: string;
  descriptionTh: string;
  descriptionEn: string;
  seatsTh: string | null;
  seatsEn: string | null;
  slug: string;
  sortOrder: number;
  active: number;
};

const emptyForm = {
  nameTh: "",
  nameEn: "",
  descriptionTh: "",
  descriptionEn: "",
  seatsTh: "",
  seatsEn: "",
  slug: "",
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [imageCounts, setImageCounts] = useState<Record<number, number>>({});

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/services");
      const json = await res.json();
      if (json.success) {
        setServices(json.data);
        // Fetch image counts for each service
        for (const svc of json.data as Service[]) {
          fetch(`/api/admin/services/${svc.id}/images`)
            .then((r) => r.json())
            .then((j) => {
              if (j.success) {
                setImageCounts((prev) => ({ ...prev, [svc.id]: j.data.length }));
              }
            });
        }
      }
    } catch {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  async function handleCreate() {
    if (!form.nameTh || !form.nameEn || !form.descriptionTh || !form.descriptionEn || !form.slug) {
      toast.error("Please fill in all required fields");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("Service created");
      setForm(emptyForm);
      setAddOpen(false);
      fetchServices();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create service");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/services/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("Service deleted");
      setDeleteTarget(null);
      fetchServices();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete service");
    } finally {
      setDeleting(false);
    }
  }

  async function toggleActive(service: Service) {
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: service.active ? 0 : 1 }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success(service.active ? "Service deactivated" : "Service activated");
      fetchServices();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to toggle service");
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Services</h2>
          <p className="text-sm text-muted-foreground">
            Manage your transport services
          </p>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
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
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button onClick={handleCreate} disabled={creating}>
                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {services.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <p className="text-muted-foreground">No services yet. Add your first service.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <Card key={service.id} className="flex items-center gap-4 p-4">
              <GripVertical className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{service.nameTh}</span>
                  <span className="text-sm text-muted-foreground truncate">
                    / {service.nameEn}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  {service.seatsTh && <span>{service.seatsTh}</span>}
                  <span className="flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" />
                    {imageCounts[service.id] ?? 0} images
                  </span>
                </div>
              </div>
              <Badge variant={service.active ? "default" : "secondary"}>
                {service.active ? "Active" : "Inactive"}
              </Badge>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleActive(service)}
                >
                  {service.active ? "Deactivate" : "Activate"}
                </Button>
                <Link
                  href={`/admin/services/${service.id}`}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 w-10 hover:bg-accent hover:text-accent-foreground"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleteTarget(service)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open: boolean) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete &quot;{deleteTarget?.nameTh}&quot;? This will also
            delete all associated images. This action cannot be undone.
          </p>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
