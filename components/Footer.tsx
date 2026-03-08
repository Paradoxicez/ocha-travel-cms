import Image from "next/image";
import { MapPin, Phone, Clock } from "lucide-react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import SocialLinks from "./SocialLinks";

export default function Footer({ dict }: { dict: Dictionary }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 pb-12 pt-24 text-zinc-400">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white">
                <Image
                  src="/logos/Ocha-Symbol-Only_0.png"
                  alt="Ocha Travel Transport"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold leading-none tracking-tight text-white">
                  {dict.brand.name}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
                  {dict.brand.tagline}
                </span>
              </div>
            </div>
            <p className="mb-1 text-sm font-semibold text-zinc-300">{dict.footer.company}</p>
            <p className="mb-6 text-sm leading-relaxed">{dict.footer.desc}</p>
            <SocialLinks location="footer" />
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="mb-6 font-bold text-white">{dict.footer.links}</h5>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href="#services"
                  className="transition-colors hover:text-primary"
                >
                  {dict.nav.services}
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="transition-colors hover:text-primary"
                >
                  {dict.nav.about}
                </a>
              </li>
              <li>
                <a
                  href="#service-areas"
                  className="transition-colors hover:text-primary"
                >
                  {dict.nav.serviceAreas}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="transition-colors hover:text-primary"
                >
                  {dict.nav.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h5 className="mb-6 font-bold text-white">
              {dict.footer.services}
            </h5>
            <ul className="space-y-4 text-sm">
              {dict.services.items.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <a
                    href="#services"
                    className="transition-colors hover:text-primary"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h5 className="mb-6 font-bold text-white">
              {dict.footer.contactInfo}
            </h5>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="h-[18px] w-[18px] shrink-0 text-primary" />
                <span>{dict.footer.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-[18px] w-[18px] shrink-0 text-primary" />
                <a
                  href="tel:0661244999"
                  className="transition-colors hover:text-primary"
                >
                  {dict.footer.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="h-[18px] w-[18px] shrink-0 text-primary" />
                <span>{dict.footer.available247}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-12 text-center text-xs">
          <p>{dict.footer.copyright.replace("{year}", String(year))}</p>
        </div>
      </div>
    </footer>
  );
}
