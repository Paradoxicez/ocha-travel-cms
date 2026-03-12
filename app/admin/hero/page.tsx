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

type HeroData = {
  titleMainTh: string;
  titleMainEn: string;
  titleAccentTh: string;
  titleAccentEn: string;
  subtitleTh: string;
  subtitleEn: string;
  ctaTextTh: string;
  ctaTextEn: string;
  bgImagePath: string | null;
};

const empty: HeroData = {
  titleMainTh: "",
  titleMainEn: "",
  titleAccentTh: "",
  titleAccentEn: "",
  subtitleTh: "",
  subtitleEn: "",
  ctaTextTh: "",
  ctaTextEn: "",
  bgImagePath: null,
};

export default function HeroPage() {
  const [data, setData] = useState<HeroData>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/hero")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setData(json.data);
        }
      })
      .catch(() => toast.error("Failed to load hero content"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("Hero content saved");
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
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <BilingualInput
            label="Title (Main)"
            valueTh={data.titleMainTh}
            valueEn={data.titleMainEn}
            onChangeTh={(v) => setData({ ...data, titleMainTh: v })}
            onChangeEn={(v) => setData({ ...data, titleMainEn: v })}
          />
          <BilingualInput
            label="Title (Accent)"
            valueTh={data.titleAccentTh}
            valueEn={data.titleAccentEn}
            onChangeTh={(v) => setData({ ...data, titleAccentTh: v })}
            onChangeEn={(v) => setData({ ...data, titleAccentEn: v })}
          />
          <BilingualInput
            label="Subtitle"
            valueTh={data.subtitleTh}
            valueEn={data.subtitleEn}
            onChangeTh={(v) => setData({ ...data, subtitleTh: v })}
            onChangeEn={(v) => setData({ ...data, subtitleEn: v })}
          />
          <BilingualInput
            label="CTA Text"
            valueTh={data.ctaTextTh}
            valueEn={data.ctaTextEn}
            onChangeTh={(v) => setData({ ...data, ctaTextTh: v })}
            onChangeEn={(v) => setData({ ...data, ctaTextEn: v })}
          />

          <Separator />

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Background Image</Label>
            <ImageUploader
              currentImage={data.bgImagePath}
              onUploaded={(path) => setData({ ...data, bgImagePath: path })}
              onRemove={() => setData({ ...data, bgImagePath: null })}
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
