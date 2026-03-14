"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Phone, Menu, X } from "lucide-react";
import type { Dictionary, Lang } from "@/app/[lang]/dictionaries";
import type { SiteContent } from "@/lib/content";

const navItems = (dict: Dictionary) => [
  { id: "services", label: dict.nav.services },
  { id: "about", label: dict.nav.about },
  { id: "portfolio", label: dict.nav.portfolio },
  { id: "contact", label: dict.nav.contact },
];

export default function Header({
  dict,
  lang,
  content,
}: {
  dict: Dictionary;
  lang: Lang;
  content?: SiteContent;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const brandName = content?.settings?.businessName || dict.brand.name;
  const brandTagline = content?.settings?.tagline || dict.brand.tagline;

  const items = navItems(dict);

  const langSwitcher = (
    <div className="flex rounded-full bg-zinc-100 p-1">
      <Link
        href="/th"
        className={`rounded-full px-3 py-1 text-[10px] font-bold transition-all ${
          lang === "th"
            ? "bg-primary text-white shadow-sm"
            : "text-zinc-500 hover:text-secondary"
        }`}
      >
        TH
      </Link>
      <Link
        href="/en"
        className={`rounded-full px-3 py-1 text-[10px] font-bold transition-all ${
          lang === "en"
            ? "bg-primary text-white shadow-sm"
            : "text-zinc-500 hover:text-secondary"
        }`}
      >
        EN
      </Link>
    </div>
  );

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 py-3 shadow-sm backdrop-blur-md"
          : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link href={`/${lang}`} className="flex items-center gap-2">
          <Image
            src="/logos/Ocha-Symbol-Only_0.png"
            alt="Ocha Travel Transport"
            width={44}
            height={44}
            className={`h-10 w-10 transition-all duration-300 ${
              scrolled ? "" : "brightness-0 invert drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
            }`}
            priority
          />
          <div className="flex flex-col">
            <span className={`text-xl font-extrabold leading-none tracking-tight transition-colors duration-300 ${scrolled ? "text-secondary" : "text-white"}`}>
              {brandName}
            </span>
            <span className={`text-[9px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${scrolled ? "text-primary" : "text-white/80"}`}>
              {brandTagline}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                scrolled ? "text-secondary" : "text-white"
              }`}
            >
              {item.label}
            </a>
          ))}
          <a
            href="tel:0661244999"
            className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-rose-600"
          >
            <Phone className="h-4 w-4" />
            {dict.nav.callNow}
          </a>
          {langSwitcher}
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`p-2 ${scrolled ? "text-secondary" : "text-white"}`}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
          {langSwitcher}
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="border-t bg-white px-6 pb-4 pt-2 md:hidden">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-sm font-medium text-secondary"
            >
              {item.label}
            </a>
          ))}
          <a
            href="tel:0661244999"
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white"
          >
            <Phone className="h-4 w-4" />
            {dict.nav.callNow}
          </a>
        </nav>
      )}
    </nav>
  );
}
