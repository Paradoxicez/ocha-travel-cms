"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Image, MapPin, Share2, Type, Info, Phone, Search, Settings } from "lucide-react";
import { toast } from "sonner";

type Stats = {
  services: number;
  galleryImages: number;
  regions: number;
  socialLinks: number;
};

const quickLinks = [
  { href: "/admin/hero", label: "Hero Section", icon: Type, color: "text-blue-600" },
  { href: "/admin/about", label: "About Us", icon: Info, color: "text-green-600" },
  { href: "/admin/services", label: "Services", icon: Car, color: "text-purple-600" },
  { href: "/admin/gallery", label: "Gallery", icon: Image, color: "text-pink-600" },
  { href: "/admin/regions", label: "Service Areas", icon: MapPin, color: "text-orange-600" },
  { href: "/admin/contact", label: "Contact", icon: Phone, color: "text-teal-600" },
  { href: "/admin/seo", label: "SEO", icon: Search, color: "text-yellow-600" },
  { href: "/admin/settings", label: "Settings", icon: Settings, color: "text-gray-600" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    services: 0,
    galleryImages: 0,
    regions: 0,
    socialLinks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [servicesRes, galleryRes, regionsRes, socialRes] = await Promise.all([
          fetch("/api/admin/services").then((r) => r.json()),
          fetch("/api/admin/gallery-categories").then((r) => r.json()),
          fetch("/api/admin/service-regions").then((r) => r.json()),
          fetch("/api/admin/social-links").then((r) => r.json()),
        ]);

        const galleryImageCount = galleryRes.success
          ? galleryRes.data.reduce((sum: number, cat: { imageCount?: number }) => sum + (cat.imageCount || 0), 0)
          : 0;

        setStats({
          services: servicesRes.success ? servicesRes.data.length : 0,
          galleryImages: galleryImageCount,
          regions: regionsRes.success ? regionsRes.data.length : 0,
          socialLinks: socialRes.success ? socialRes.data.length : 0,
        });
      } catch {
        toast.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const summaryCards = [
    { label: "Services", value: stats.services, icon: Car, color: "text-purple-600 bg-purple-50" },
    { label: "Gallery Images", value: stats.galleryImages, icon: Image, color: "text-pink-600 bg-pink-50" },
    { label: "Service Regions", value: stats.regions, icon: MapPin, color: "text-orange-600 bg-orange-50" },
    { label: "Social Links", value: stats.socialLinks, icon: Share2, color: "text-blue-600 bg-blue-50" },
  ];

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`rounded-lg p-3 ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="text-2xl font-bold">
                  {loading ? "-" : card.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-zinc-50"
              >
                <link.icon className={`h-5 w-5 ${link.color}`} />
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
