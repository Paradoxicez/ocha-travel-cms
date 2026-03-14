"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Plus, Pencil, Trash2, Image, Loader2 } from "lucide-react";

type Category = {
  id: number;
  nameTh: string;
  nameEn: string;
  slug: string;
  sortOrder: number;
  active: number;
  imageCount: number;
};

export default function GalleryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Add dialog state
  const [addOpen, setAddOpen] = useState(false);
  const [addNameTh, setAddNameTh] = useState("");
  const [addNameEn, setAddNameEn] = useState("");
  const [addSlug, setAddSlug] = useState("");
  const [adding, setAdding] = useState(false);

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [editNameTh, setEditNameTh] = useState("");
  const [editNameEn, setEditNameEn] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editing, setEditing] = useState(false);

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/admin/gallery-categories");
      const json = await res.json();
      if (json.success) {
        setCategories(json.data);
      }
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleAdd() {
    if (!addNameTh || !addNameEn || !addSlug) {
      toast.error("Please fill in all fields");
      return;
    }

    setAdding(true);
    try {
      const res = await fetch("/api/admin/gallery-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameTh: addNameTh,
          nameEn: addNameEn,
          slug: addSlug,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create");
      toast.success("Category created");
      setAddOpen(false);
      setAddNameTh("");
      setAddNameEn("");
      setAddSlug("");
      fetchCategories();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create category");
    } finally {
      setAdding(false);
    }
  }

  function openEdit(cat: Category) {
    setEditCategory(cat);
    setEditNameTh(cat.nameTh);
    setEditNameEn(cat.nameEn);
    setEditSlug(cat.slug);
    setEditOpen(true);
  }

  async function handleEdit() {
    if (!editCategory || !editNameTh || !editNameEn || !editSlug) return;

    setEditing(true);
    try {
      const res = await fetch(
        `/api/admin/gallery-categories/${editCategory.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nameTh: editNameTh,
            nameEn: editNameEn,
            slug: editSlug,
          }),
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update");
      toast.success("Category updated");
      setEditOpen(false);
      fetchCategories();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update category");
    } finally {
      setEditing(false);
    }
  }

  function openDelete(cat: Category) {
    setDeleteCategory(cat);
    setDeleteOpen(true);
  }

  async function handleDelete() {
    if (!deleteCategory) return;

    setDeleting(true);
    try {
      const res = await fetch(
        `/api/admin/gallery-categories/${deleteCategory.id}`,
        { method: "DELETE" },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete");
      toast.success("Category deleted");
      setDeleteOpen(false);
      setDeleteCategory(null);
      fetchCategories();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete category");
    } finally {
      setDeleting(false);
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
        <h2 className="text-2xl font-bold">Gallery Categories</h2>

        {/* Add Category Dialog */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Gallery Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <BilingualInput
                label="Category Name"
                valueTh={addNameTh}
                valueEn={addNameEn}
                onChangeTh={setAddNameTh}
                onChangeEn={setAddNameEn}
              />
              <div>
                <Label className="text-sm font-semibold">Slug</Label>
                <Input
                  value={addSlug}
                  onChange={(e) => setAddSlug(e.target.value)}
                  placeholder="e.g. vip-buses"
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button onClick={handleAdd} disabled={adding}>
                {adding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Cards */}
      {categories.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          <Image className="mx-auto mb-4 h-12 w-12" />
          <p>No gallery categories yet. Click &quot;Add Category&quot; to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Card key={cat.id} className="relative">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{cat.nameTh}</CardTitle>
                <p className="text-sm text-muted-foreground">{cat.nameEn}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Image className="h-4 w-4" />
                    <span>{cat.imageCount} images</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href={`/admin/gallery/${cat.id}`}>
                      <Button variant="outline" size="sm">
                        Manage Images
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(cat)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => openDelete(cat)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <BilingualInput
              label="Category Name"
              valueTh={editNameTh}
              valueEn={editNameEn}
              onChangeTh={setEditNameTh}
              onChangeEn={setEditNameEn}
            />
            <div>
              <Label className="text-sm font-semibold">Slug</Label>
              <Input
                value={editSlug}
                onChange={(e) => setEditSlug(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button onClick={handleEdit} disabled={editing}>
              {editing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-sm text-muted-foreground">
            Are you sure you want to delete &quot;{deleteCategory?.nameTh}&quot;?
            This will also delete all {deleteCategory?.imageCount} images in this
            category. This action cannot be undone.
          </p>
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
