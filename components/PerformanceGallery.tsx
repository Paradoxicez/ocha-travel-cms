"use client";

import { useState } from "react";
import CoverFlowGallery from "./CoverFlowGallery";
import type { Dictionary } from "@/app/[lang]/dictionaries";

const performanceImages: Record<string, string[]> = {
  general: [
    "1525947_0", "1525948_0", "1525949_0", "1525950_0", "1525951_0",
    "1525952_0", "1525953_0", "1525954_0", "1525955_0", "1525956_0",
    "1525957_0", "1525958_0", "1525959_0", "1525960_0", "1525961_0",
    "1525962_0", "1525963_0", "1525964_0", "1525965_0", "1525966_0",
    "1525968_0", "1525969_0", "1525970_0", "1525971_0",
    "1525972_0", "1525973_0", "1525974_0", "1525975_0", "1525976_0",
    "1525977_0", "1525978_0", "1525979_0", "1525980_0", "1525981_0",
    "1525982_0", "1525983_0", "1525984_0", "1525985_0", "1525986_0",
    "1525987_0", "1525988_0", "1525989_0", "1525990_0", "1525991_0",
    "1525992_0", "1525993_0", "1525994_0",
  ].map((f) => `/pics/performance/Pick-up and drop-off-service/${f}.jpg`),

  transport: [
    "1525997_0", "1525998_0", "1526000_0", "1526001_0", "1526002_0",
    "1526003_0", "1526004_0", "1526005_0", "1526006_0", "1526007_0",
    "1526008_0", "1526009_0", "1526010_0", "1526011_0", "1526012_0",
    "1526013_0", "1526014_0", "1526015_0", "1526016_0", "1526018_0",
    "1526019_0", "1526020_0", "1526021_0", "1526022_0", "1526023_0",
    "1526024_0", "1526025_0", "1526026_0", "1526028_0", "1526030_0",
    "1526031_0", "1526032_0",
  ].map((f) => `/pics/performance/transport-service/${f}.jpg`),

  van: [
    "1526034_0", "1526035_0", "1526036_0", "1526037_0", "1526038_0",
    "1526039_0", "1526042_0", "1526043_0", "1526044_0", "1526045_0",
    "1526046_0", "1526047_0", "1526048_0", "1526049_0", "1526050_0",
    "1526052_0", "1526053_0", "1526054_0", "1526055_0", "1526056_0",
    "1526057_0", "1526058_0", "1526059_0", "1526060_0", "1526061_0",
    "1526063_0", "1526064_0", "1526067_0", "1526068_0", "1526069_0",
    "1526071_0", "1526072_0", "1526073_0", "1526074_0", "1526075_0",
    "1526076_0", "1526078_0", "1526079_0", "1526080_0", "1526082_0",
    "1526083_0", "1526261_0", "1526613_0", "1526888_0", "1527419_0",
  ].map((f) => `/pics/performance/van-service/${f}.jpg`),
};

const tabKeys = ["general", "transport", "van"] as const;

export default function PerformanceGallery({ dict }: { dict: Dictionary }) {
  const [activeTab, setActiveTab] = useState<(typeof tabKeys)[number]>("general");

  return (
    <section id="portfolio" className="bg-zinc-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">
            {dict.portfolio.badge}
          </h2>
          <h3 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            {dict.portfolio.title}
          </h3>
          <p className="mx-auto max-w-lg text-zinc-400">
            {dict.portfolio.subtitle}
          </p>
        </div>

        <div className="mb-10 flex justify-center gap-2">
          {tabKeys.map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
                activeTab === key
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {dict.portfolio.tabs[key]}
            </button>
          ))}
        </div>

        <CoverFlowGallery
          key={activeTab}
          images={performanceImages[activeTab]}
          alt={dict.portfolio.alt[activeTab]}
        />
      </div>
    </section>
  );
}
