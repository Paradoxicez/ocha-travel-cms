"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BilingualInput from "@/components/admin/BilingualInput";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";

type Region = {
  id?: number;
  nameTh: string;
  nameEn: string;
  provincesTh: string;
  provincesEn: string;
};

export default function RegionsPage() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/service-regions")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setRegions(json.data);
      })
      .catch(() => toast.error("Failed to load regions"))
      .finally(() => setLoading(false));
  }, []);

  function addRegion() {
    setRegions([...regions, { nameTh: "", nameEn: "", provincesTh: "", provincesEn: "" }]);
  }

  function updateRegion(index: number, field: keyof Region, value: string) {
    const updated = [...regions];
    updated[index] = { ...updated[index], [field]: value };
    setRegions(updated);
  }

  async function saveRegion(index: number) {
    const item = regions[index];
    if (!item.nameTh || !item.nameEn || !item.provincesTh || !item.provincesEn) {
      toast.error("All fields are required");
      return;
    }

    try {
      if (item.id) {
        const res = await fetch(`/api/admin/service-regions/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        const updated = [...regions];
        updated[index] = json.data;
        setRegions(updated);
      } else {
        const res = await fetch("/api/admin/service-regions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        const updated = [...regions];
        updated[index] = json.data;
        setRegions(updated);
      }
      toast.success("Region saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save region");
    }
  }

  async function deleteRegion(index: number) {
    const item = regions[index];
    if (item.id) {
      try {
        const res = await fetch(`/api/admin/service-regions/${item.id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete");
        toast.success("Region deleted");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to delete");
        return;
      }
    }
    setRegions(regions.filter((_, i) => i !== index));
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Service Regions</CardTitle>
          <Button size="sm" variant="outline" onClick={addRegion}>
            <Plus className="mr-1 h-4 w-4" /> Add Region
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {regions.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              No regions yet. Click Add Region to create one.
            </p>
          )}
          {regions.map((item, index) => (
            <div key={item.id ?? `new-${index}`} className="space-y-3 rounded-lg border p-4">
              <BilingualInput
                label="Region Name"
                valueTh={item.nameTh}
                valueEn={item.nameEn}
                onChangeTh={(v) => updateRegion(index, "nameTh", v)}
                onChangeEn={(v) => updateRegion(index, "nameEn", v)}
              />
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Provinces (TH) - comma separated
                  </Label>
                  <Input
                    value={item.provincesTh}
                    onChange={(e) => updateRegion(index, "provincesTh", e.target.value)}
                    placeholder="กรุงเทพฯ, นนทบุรี, ปทุมธานี"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Provinces (EN) - comma separated
                  </Label>
                  <Input
                    value={item.provincesEn}
                    onChange={(e) => updateRegion(index, "provincesEn", e.target.value)}
                    placeholder="Bangkok, Nonthaburi, Pathum Thani"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteRegion(index)}
                >
                  <Trash2 className="mr-1 h-4 w-4" /> Delete
                </Button>
                <Button size="sm" onClick={() => saveRegion(index)}>
                  Save Region
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
