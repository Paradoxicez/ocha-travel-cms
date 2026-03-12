"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import BilingualInput from "@/components/admin/BilingualInput";
import ImageUploader from "@/components/admin/ImageUploader";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type SeoData = {
  titleTh: string;
  titleEn: string;
  descriptionTh: string;
  descriptionEn: string;
  ogImagePath: string | null;
};

const empty: SeoData = {
  titleTh: "",
  titleEn: "",
  descriptionTh: "",
  descriptionEn: "",
  ogImagePath: null,
};

export default function SeoPage() {
  const [data, setData] = useState<SeoData>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/seo")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setData(json.data);
      })
      .catch(() => toast.error("Failed to load SEO data"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("SEO settings saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
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
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <BilingualInput
            label="Page Title"
            valueTh={data.titleTh}
            valueEn={data.titleEn}
            onChangeTh={(v) => setData({ ...data, titleTh: v })}
            onChangeEn={(v) => setData({ ...data, titleEn: v })}
          />
          <BilingualInput
            label="Meta Description"
            valueTh={data.descriptionTh}
            valueEn={data.descriptionEn}
            onChangeTh={(v) => setData({ ...data, descriptionTh: v })}
            onChangeEn={(v) => setData({ ...data, descriptionEn: v })}
            multiline
            rows={4}
          />

          <Separator />

          <div className="space-y-2">
            <Label className="text-sm font-semibold">OG Image</Label>
            <ImageUploader
              currentImage={data.ogImagePath}
              onUploaded={(path) => setData({ ...data, ogImagePath: path })}
              onRemove={() => setData({ ...data, ogImagePath: null })}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
