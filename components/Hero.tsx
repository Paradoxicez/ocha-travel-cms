import Image from "next/image";
import { Phone, ChevronDown } from "lucide-react";
import type { Dictionary } from "@/app/[lang]/dictionaries";

export default function Hero({ dict }: { dict: Dictionary }) {
  const titleParts = dict.hero.title.split(",");
  const titleMain = titleParts[0];
  const titleAccent =
    titleParts.length > 1 ? titleParts.slice(1).join(",") : "";

  return (
    <section
      id="home"
      className="relative flex h-screen items-center overflow-hidden"
    >
      <Image
        src="/pics/hero.png"
        alt=""
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <div className="max-w-2xl text-white">
          <span className="mb-6 inline-block rounded-full border border-primary/30 bg-primary/20 px-4 py-1.5 text-sm font-bold text-primary backdrop-blur-sm">
            {dict.hero.badge}
          </span>
          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
            {titleMain}
            {titleAccent && (
              <>
                ,{" "}
                <span className="text-primary">{titleAccent}</span>
              </>
            )}
          </h1>
          <p className="mb-10 max-w-lg text-lg leading-relaxed text-zinc-300 md:text-xl">
            {dict.hero.tagline}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="tel:0661244999"
              className="flex items-center justify-center gap-3 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-white shadow-xl shadow-primary/30 transition-all hover:bg-rose-600"
            >
              <Phone className="h-5 w-5" />
              {dict.hero.cta}
            </a>
            <a
              href="#services"
              className="flex items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-md transition-all hover:bg-white/20"
            >
              {dict.hero.explore}
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
        <ChevronDown className="h-8 w-8" />
      </div>
    </section>
  );
}
