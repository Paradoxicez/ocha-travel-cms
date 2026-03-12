"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import BilingualInput from "@/components/admin/BilingualInput";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";

type ContactData = {
  phone: string;
  addressTh: string;
  addressEn: string;
  email: string;
};

type SocialLink = {
  id?: number;
  platform: string;
  url: string;
  icon: string | null;
  active: number;
};

const emptyContact: ContactData = {
  phone: "",
  addressTh: "",
  addressEn: "",
  email: "",
};

export default function ContactPage() {
  const [contact, setContact] = useState<ContactData>(emptyContact);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/contact-info").then((r) => r.json()),
      fetch("/api/admin/social-links").then((r) => r.json()),
    ])
      .then(([contactJson, linksJson]) => {
        if (contactJson.success && contactJson.data) setContact(contactJson.data);
        if (linksJson.success) setLinks(linksJson.data);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  async function saveContact() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/contact-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("Contact info saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function addLink() {
    setLinks([...links, { platform: "", url: "", icon: null, active: 1 }]);
  }

  function updateLink(index: number, field: string, value: string | number | null) {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: value };
    setLinks(updated);
  }

  async function toggleActive(index: number) {
    const item = links[index];
    const newActive = item.active === 1 ? 0 : 1;

    if (item.id) {
      try {
        const res = await fetch(`/api/admin/social-links/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ active: newActive }),
        });
        if (!res.ok) throw new Error("Failed to toggle");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to toggle");
        return;
      }
    }

    const updated = [...links];
    updated[index] = { ...updated[index], active: newActive };
    setLinks(updated);
  }

  async function saveLink(index: number) {
    const item = links[index];
    if (!item.platform || !item.url) {
      toast.error("Platform and URL are required");
      return;
    }

    try {
      if (item.id) {
        const res = await fetch(`/api/admin/social-links/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        const updated = [...links];
        updated[index] = json.data;
        setLinks(updated);
      } else {
        const res = await fetch("/api/admin/social-links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        const updated = [...links];
        updated[index] = json.data;
        setLinks(updated);
      }
      toast.success("Social link saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save link");
    }
  }

  async function deleteLink(index: number) {
    const item = links[index];
    if (item.id) {
      try {
        const res = await fetch(`/api/admin/social-links/${item.id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete");
        toast.success("Social link deleted");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to delete");
        return;
      }
    }
    setLinks(links.filter((_, i) => i !== index));
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
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-semibold">Phone</Label>
            <Input
              value={contact.phone}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              placeholder="+66..."
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">Email</Label>
            <Input
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              placeholder="email@example.com"
            />
          </div>
          <BilingualInput
            label="Address"
            valueTh={contact.addressTh}
            valueEn={contact.addressEn}
            onChangeTh={(v) => setContact({ ...contact, addressTh: v })}
            onChangeEn={(v) => setContact({ ...contact, addressEn: v })}
            multiline
            rows={3}
          />
          <div className="flex justify-end">
            <Button onClick={saveContact} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Contact Info
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Social Links</CardTitle>
          <Button size="sm" variant="outline" onClick={addLink}>
            <Plus className="mr-1 h-4 w-4" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {links.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              No social links yet. Click Add to create one.
            </p>
          )}
          {links.map((item, index) => (
            <div key={item.id ?? `new-${index}`} className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.platform || "New Link"}</span>
                  <Badge
                    variant={item.active === 1 ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => toggleActive(index)}
                  >
                    {item.active === 1 ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label className="text-xs">Platform</Label>
                  <Input
                    value={item.platform}
                    onChange={(e) => updateLink(index, "platform", e.target.value)}
                    placeholder="e.g. Facebook, Line, Instagram"
                  />
                </div>
                <div>
                  <Label className="text-xs">URL</Label>
                  <Input
                    value={item.url}
                    onChange={(e) => updateLink(index, "url", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteLink(index)}
                >
                  <Trash2 className="mr-1 h-4 w-4" /> Delete
                </Button>
                <Button size="sm" onClick={() => saveLink(index)}>
                  Save Link
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
