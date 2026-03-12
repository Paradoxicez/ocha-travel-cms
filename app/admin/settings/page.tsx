"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import BilingualInput from "@/components/admin/BilingualInput";
import ImageUploader from "@/components/admin/ImageUploader";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type SettingsData = {
  businessNameTh: string;
  businessNameEn: string;
  taglineTh: string;
  taglineEn: string;
  logoPath: string | null;
  primaryColor: string;
  secondaryColor: string;
};

const empty: SettingsData = {
  businessNameTh: "",
  businessNameEn: "",
  taglineTh: "",
  taglineEn: "",
  logoPath: null,
  primaryColor: "#E11D48",
  secondaryColor: "#000000",
};

export default function SettingsPage() {
  const [data, setData] = useState<SettingsData>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/site-settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setData(json.data);
      })
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("Settings saved");
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
          <CardTitle>Site Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <BilingualInput
            label="Business Name"
            valueTh={data.businessNameTh}
            valueEn={data.businessNameEn}
            onChangeTh={(v) => setData({ ...data, businessNameTh: v })}
            onChangeEn={(v) => setData({ ...data, businessNameEn: v })}
          />
          <BilingualInput
            label="Tagline"
            valueTh={data.taglineTh}
            valueEn={data.taglineEn}
            onChangeTh={(v) => setData({ ...data, taglineTh: v })}
            onChangeEn={(v) => setData({ ...data, taglineEn: v })}
          />

          <Separator />

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Logo</Label>
            <ImageUploader
              currentImage={data.logoPath}
              onUploaded={(path) => setData({ ...data, logoPath: path })}
              onRemove={() => setData({ ...data, logoPath: null })}
            />
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Primary Color</Label>
              <div className="flex items-center gap-3">
                <Input
                  value={data.primaryColor}
                  onChange={(e) => setData({ ...data, primaryColor: e.target.value })}
                  placeholder="#E11D48"
                />
                <div
                  className="h-10 w-10 shrink-0 rounded-lg border"
                  style={{ backgroundColor: data.primaryColor }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Secondary Color</Label>
              <div className="flex items-center gap-3">
                <Input
                  value={data.secondaryColor}
                  onChange={(e) => setData({ ...data, secondaryColor: e.target.value })}
                  placeholder="#000000"
                />
                <div
                  className="h-10 w-10 shrink-0 rounded-lg border"
                  style={{ backgroundColor: data.secondaryColor }}
                />
              </div>
            </div>
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
