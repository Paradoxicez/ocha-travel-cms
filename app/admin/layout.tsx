"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Image,
  Car,
  MapPin,
  Phone,
  Search,
  Settings,
  Type,
  Info,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/hero", label: "Hero", icon: Type },
  { href: "/admin/about", label: "About Us", icon: Info },
  { href: "/admin/services", label: "Services", icon: Car },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/regions", label: "Service Areas", icon: MapPin },
  { href: "/admin/contact", label: "Contact", icon: Phone },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return (
      <>
        {children}
        <Toaster richColors position="top-right" />
      </>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-zinc-900 text-white transition-transform lg:static lg:translate-x-0 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-6">
              <Link href="/admin" className="text-lg font-bold">
                Ocha Admin
              </Link>
              <button
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-1 p-4">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" &&
                    pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-800 p-4">
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </form>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <header className="flex h-16 items-center border-b bg-white px-6">
              <button
                className="mr-4 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-semibold">
                {navItems.find(
                  (item) =>
                    pathname === item.href ||
                    (item.href !== "/admin" &&
                      pathname.startsWith(item.href)),
                )?.label || "Admin"}
              </h1>
            </header>
            <div className="p-6">{children}</div>
          </main>
          <Toaster richColors position="top-right" />
        </div>
  );
}
