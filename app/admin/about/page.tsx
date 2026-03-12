"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import BilingualInput from "@/components/admin/BilingualInput";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";

type AboutData = {
  titleTh: string;
  titleEn: string;
  descriptionTh: string;
  descriptionEn: string;
};

type TrustIndicator = {
  id?: number;
  icon: string;
  value: string;
  labelTh: string;
  labelEn: string;
};

const emptyAbout: AboutData = {
  titleTh: "",
  titleEn: "",
  descriptionTh: "",
  descriptionEn: "",
};

export default function AboutPage() {
  const [about, setAbout] = useState<AboutData>(emptyAbout);
  const [indicators, setIndicators] = useState<TrustIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/about").then((r) => r.json()),
      fetch("/api/admin/trust-indicators").then((r) => r.json()),
    ])
      .then(([aboutJson, indicatorsJson]) => {
        if (aboutJson.success && aboutJson.data) setAbout(aboutJson.data);
        if (indicatorsJson.success) setIndicators(indicatorsJson.data);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  async function saveAbout() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(about),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("About content saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function addIndicator() {
    setIndicators([...indicators, { icon: "", value: "", labelTh: "", labelEn: "" }]);
  }

  function updateIndicator(index: number, field: keyof TrustIndicator, value: string) {
    const updated = [...indicators];
    updated[index] = { ...updated[index], [field]: value };
    setIndicators(updated);
  }

  async function saveIndicator(index: number) {
    const item = indicators[index];
    if (!item.icon || !item.value || !item.labelTh || !item.labelEn) {
      toast.error("All indicator fields are required");
      return;
    }

    try {
      if (item.id) {
        const res = await fetch(`/api/admin/trust-indicators/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        const updated = [...indicators];
        updated[index] = json.data;
        setIndicators(updated);
      } else {
        const res = await fetch("/api/admin/trust-indicators", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        const updated = [...indicators];
        updated[index] = json.data;
        setIndicators(updated);
      }
      toast.success("Indicator saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save indicator");
    }
  }

  async function deleteIndicator(index: number) {
    const item = indicators[index];
    if (item.id) {
      try {
        const res = await fetch(`/api/admin/trust-indicators/${item.id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete");
        toast.success("Indicator deleted");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to delete");
        return;
      }
    }
    setIndicators(indicators.filter((_, i) => i !== index));
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
          <CardTitle>About Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <BilingualInput
            label="Title"
            valueTh={about.titleTh}
            valueEn={about.titleEn}
            onChangeTh={(v) => setAbout({ ...about, titleTh: v })}
            onChangeEn={(v) => setAbout({ ...about, titleEn: v })}
          />
          <BilingualInput
            label="Description"
            valueTh={about.descriptionTh}
            valueEn={about.descriptionEn}
            onChangeTh={(v) => setAbout({ ...about, descriptionTh: v })}
            onChangeEn={(v) => setAbout({ ...about, descriptionEn: v })}
            multiline
            rows={5}
          />
          <div className="flex justify-end">
            <Button onClick={saveAbout} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save About
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Trust Indicators</CardTitle>
          <Button size="sm" variant="outline" onClick={addIndicator}>
            <Plus className="mr-1 h-4 w-4" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {indicators.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              No trust indicators yet. Click Add to create one.
            </p>
          )}
          {indicators.map((item, index) => (
            <div key={item.id ?? `new-${index}`} className="space-y-3 rounded-lg border p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label className="text-xs">Icon (e.g. Shield, Clock)</Label>
                  <Input
                    value={item.icon}
                    onChange={(e) => updateIndicator(index, "icon", e.target.value)}
                    placeholder="Icon name"
                  />
                </div>
                <div>
                  <Label className="text-xs">Value (e.g. 10+, 24/7)</Label>
                  <Input
                    value={item.value}
                    onChange={(e) => updateIndicator(index, "value", e.target.value)}
                    placeholder="Display value"
                  />
                </div>
              </div>
              <BilingualInput
                label="Label"
                valueTh={item.labelTh}
                valueEn={item.labelEn}
                onChangeTh={(v) => updateIndicator(index, "labelTh", v)}
                onChangeEn={(v) => updateIndicator(index, "labelEn", v)}
              />
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteIndicator(index)}
                >
                  <Trash2 className="mr-1 h-4 w-4" /> Delete
                </Button>
                <Button size="sm" onClick={() => saveIndicator(index)}>
                  Save Indicator
                </Button>
              </div>
              {index < indicators.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
