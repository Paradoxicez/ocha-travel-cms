"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { SiteContent } from "@/lib/content";

/* Pin positions for all 77 provinces — calibrated from real lat/lon */
const regionPins: { x: number; y: number; label: string }[][] = [
  // 0 กรุงเทพฯ และปริมณฑล
  [
    { x: 40.1, y: 46.5, label: "กรุงเทพฯ" },
    { x: 39.9, y: 45.8, label: "นนทบุรี" },
    { x: 40.2, y: 44.8, label: "ปทุมธานี" },
    { x: 41.0, y: 47.5, label: "สมุทรปราการ" },
    { x: 37.2, y: 47.8, label: "สมุทรสาคร" },
    { x: 34.5, y: 46.1, label: "นครปฐม" },
  ],
  // 1 ภาคกลาง
  [
    { x: 40.6, y: 42.7, label: "อยุธยา" },
    { x: 39.2, y: 41.1, label: "อ่างทอง" },
    { x: 41.2, y: 39.8, label: "ลพบุรี" },
    { x: 38.7, y: 39.2, label: "สิงห์บุรี" },
    { x: 35.6, y: 37.3, label: "ชัยนาท" },
    { x: 44.6, y: 41.5, label: "สระบุรี" },
    { x: 48.1, y: 43.6, label: "นครนายก" },
    { x: 35.4, y: 41.9, label: "สุพรรณบุรี" },
  ],
  // 2 ภาคเหนือ
  [
    { x: 22.3, y: 14.1, label: "เชียงใหม่" },
    { x: 32.1, y: 6.8, label: "เชียงราย" },
    { x: 22.6, y: 15.5, label: "ลำพูน" },
    { x: 28.2, y: 17.3, label: "ลำปาง" },
    { x: 10.6, y: 10.8, label: "แม่ฮ่องสอน" },
    { x: 35.7, y: 18.3, label: "แพร่" },
    { x: 42.9, y: 14.1, label: "น่าน" },
    { x: 32.9, y: 11.6, label: "พะเยา" },
    { x: 35.2, y: 21.6, label: "อุตรดิตถ์" },
    { x: 32.0, y: 25.5, label: "สุโขทัย" },
    { x: 24.0, y: 26.4, label: "ตาก" },
    { x: 28.5, y: 28.9, label: "กำแพงเพชร" },
    { x: 38.1, y: 29.2, label: "พิจิตร" },
    { x: 37.2, y: 26.8, label: "พิษณุโลก" },
    { x: 47.4, y: 29.3, label: "เพชรบูรณ์" },
    { x: 35.4, y: 34.0, label: "นครสวรรค์" },
    { x: 34.3, y: 36.0, label: "อุทัยธานี" },
  ],
  // 3 ภาคอีสาน
  [
    { x: 58.3, y: 38.7, label: "นครราชสีมา" },
    { x: 69.8, y: 38.5, label: "บุรีรัมย์" },
    { x: 74.3, y: 39.3, label: "สุรินทร์" },
    { x: 83.9, y: 37.7, label: "ศรีสะเกษ" },
    { x: 90.1, y: 37.0, label: "อุบลฯ" },
    { x: 82.0, y: 33.4, label: "ยโสธร" },
    { x: 57.5, y: 33.3, label: "ชัยภูมิ" },
    { x: 87.5, y: 32.9, label: "อำนาจเจริญ" },
    { x: 62.2, y: 24.3, label: "หนองบัวลำภู" },
    { x: 66.7, y: 29.3, label: "ขอนแก่น" },
    { x: 66.3, y: 23.0, label: "อุดรธานี" },
    { x: 53.9, y: 22.4, label: "เลย" },
    { x: 65.7, y: 20.0, label: "หนองคาย" },
    { x: 72.1, y: 30.9, label: "มหาสารคาม" },
    { x: 76.2, y: 31.7, label: "ร้อยเอ็ด" },
    { x: 74.6, y: 29.3, label: "กาฬสินธุ์" },
    { x: 82.0, y: 24.6, label: "สกลนคร" },
    { x: 89.2, y: 23.1, label: "นครพนม" },
    { x: 88.5, y: 28.6, label: "มุกดาหาร" },
    { x: 76.2, y: 16.8, label: "บึงกาฬ" },
  ],
  // 4 ภาคตะวันออก
  [
    { x: 45.4, y: 49.1, label: "ชลบุรี" },
    { x: 48.8, y: 53.4, label: "ระยอง" },
    { x: 58.3, y: 53.9, label: "จันทบุรี" },
    { x: 63.0, y: 56.3, label: "ตราด" },
    { x: 46.4, y: 46.9, label: "ฉะเชิงเทรา" },
    { x: 49.9, y: 44.6, label: "ปราจีนบุรี" },
    { x: 57.9, y: 46.2, label: "สระแก้ว" },
  ],
  // 5 ภาคตะวันตก
  [
    { x: 31.9, y: 47.9, label: "ราชบุรี" },
    { x: 28.6, y: 44.8, label: "กาญจนบุรี" },
    { x: 34.1, y: 48.7, label: "สมุทรสงคราม" },
    { x: 33.4, y: 50.7, label: "เพชรบุรี" },
    { x: 31.7, y: 59.0, label: "ประจวบฯ" },
  ],
  // 6 ภาคใต้
  [
    { x: 24.6, y: 67.5, label: "ชุมพร" },
    { x: 18.4, y: 70.9, label: "ระนอง" },
    { x: 26.3, y: 76.2, label: "สุราษฎร์ฯ" },
    { x: 17.0, y: 80.7, label: "พังงา" },
    { x: 21.5, y: 83.1, label: "กระบี่" },
    { x: 15.5, y: 84.4, label: "ภูเก็ต" },
    { x: 33.6, y: 80.8, label: "นครศรีฯ" },
    { x: 29.6, y: 86.4, label: "ตรัง" },
    { x: 35.0, y: 86.0, label: "พัทลุง" },
    { x: 40.9, y: 88.8, label: "สงขลา" },
    { x: 34.9, y: 92.5, label: "สตูล" },
  ],
];

export default function ServiceAreas({ dict, content }: { dict: Dictionary; content?: SiteContent }) {
  const [activeRegion, setActiveRegion] = useState<number | null>(null);

  const regions = content?.regions && content.regions.length > 0
    ? content.regions.map((r) => ({ name: r.name, areas: r.provinces }))
    : dict.serviceAreas.regions;

  return (
    <section id="service-areas" className="relative overflow-hidden bg-zinc-50 py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">
            {dict.serviceAreas.badge}
          </h2>
          <h3 className="mb-4 text-4xl font-bold text-secondary md:text-5xl">
            {dict.serviceAreas.title}
          </h3>
          <p className="mx-auto max-w-lg text-zinc-500">
            {dict.serviceAreas.description}
          </p>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-5">
          {/* Left — Region cards */}
          <div className="space-y-3 lg:col-span-3">
            {regions.map((region, i) => (
              <div
                key={i}
                className={`group cursor-pointer rounded-2xl border p-5 transition-all ${
                  activeRegion === i
                    ? "border-primary/30 bg-white shadow-md shadow-primary/5"
                    : "border-zinc-200 bg-white shadow-sm hover:border-primary/20 hover:shadow-md"
                }`}
                onMouseEnter={() => setActiveRegion(i)}
                onMouseLeave={() => setActiveRegion(null)}
                onClick={() => setActiveRegion(activeRegion === i ? null : i)}
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      activeRegion === i
                        ? "bg-primary text-white"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <MapPin className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-bold text-secondary">
                    {region.name}
                  </h4>
                  <span className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-400">
                    {region.areas.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {region.areas.map((area) => (
                    <span
                      key={area}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        activeRegion === i
                          ? "bg-primary/10 text-primary"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {/* Bottom badge */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <div className="flex items-center gap-3 rounded-full border border-primary/20 bg-white px-5 py-2.5 shadow-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm text-zinc-600">
                  {dict.serviceAreas.allProvinces}
                </span>
                <span className="rounded-full bg-primary px-2.5 py-0.5 text-sm font-bold text-white">
                  77
                </span>
                <span className="text-sm text-zinc-600">
                  {dict.about.indicators.coverage.label}
                </span>
              </div>
            </div>
          </div>

          {/* Right — Thailand Map with pins */}
          <div className="sticky top-28 hidden lg:col-span-2 lg:block">
            <div className="relative mx-auto w-full max-w-sm">
              {/* Inline SVG map loaded from file */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/pics/thailand-map.svg"
                alt="Thailand Map"
                className="h-auto w-full opacity-40"
              />

              {/* Pin overlay - absolute on top of map */}
              <div className="absolute inset-0">
                {regionPins.map((pins, regionIdx) =>
                  pins.map((pin, pinIdx) => {
                    const isActive = activeRegion === regionIdx;
                    const isAnyActive = activeRegion !== null;
                    return (
                      <div
                        key={`${regionIdx}-${pinIdx}`}
                        className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                        style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                      >
                        {/* Pulse ring */}
                        {isActive && (
                          <span className="absolute inset-0 -m-2 animate-ping rounded-full bg-primary/30" />
                        )}
                        {/* Pin dot */}
                        <span
                          className={`relative block rounded-full transition-all duration-300 ${
                            isActive
                              ? "h-3.5 w-3.5 bg-primary shadow-lg shadow-primary/40"
                              : isAnyActive
                                ? "h-1.5 w-1.5 bg-zinc-300"
                                : "h-2 w-2 bg-primary/50"
                          }`}
                        />
                        {/* Label */}
                        {isActive && (
                          <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
                            {pin.label}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
