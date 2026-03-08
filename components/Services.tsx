import { Car, Truck, Star, Users, Package } from "lucide-react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import ServiceCardCarousel from "./ServiceCardCarousel";

const serviceIcons: Record<string, React.ReactNode> = {
  sedan: <Car className="h-10 w-10" />,
  suv: <Truck className="h-10 w-10" />,
  "van-10": <Users className="h-10 w-10" />,
  "vip-van": <Star className="h-10 w-10" />,
  "large-van": <Users className="h-10 w-10" />,
  pickup: <Package className="h-10 w-10" />,
};

const carImages: Record<string, string[]> = {
  sedan: [
    "1526086_0", "1526087_0",
  ].map((f) => `/pics/cars/sedan/${f}.jpg`),

  suv: [
    "1526088_0", "1526089_0", "1526090_0", "1526091_0", "1526092_0",
    "1528871", "1528872",
  ].map((f) => `/pics/cars/suv/${f}.jpg`),

  "vip-van": [
    "1526140_0", "1526141_0", "1526142_0", "1526143_0", "1526144_0",
    "1526145_0", "1526146_0", "1526147_0", "1526148_0", "1526149_0",
    "1526150_0", "1526151_0", "1526152_0", "1526153_0", "1526155_0",
    "1526156_0", "1526157_0", "1526158_0", "1526159_0", "1526160_0",
    "1526161_0", "1526162_0", "1526163_0", "1526164_0",
  ].map((f) => `/pics/cars/van-vip/${f}.jpg`),

  "large-van": [
    "1525099_0", "1526123_0", "1526124_0", "1526125_0", "1526126_0",
    "1526127_0", "1526128_0", "1526129_0", "1526130_0", "1526131_0",
    "1526132_0", "1526133_0", "1526134_0", "1526135_0", "1526137_0",
    "1526138_0",
  ].map((f) => `/pics/cars/van-13seats/${f}.jpg`),

  "van-10": [
    "1526096_0", "1526097_0", "1526098_0", "1526099_0", "1526100_0",
    "1526101_0", "1526102_0", "1526103_0", "1526104_0", "1526105_0",
    "1526106_0", "1526107_0", "1526108_0", "1526109_0", "1526110_0",
    "1526111_0", "1526112_0", "1526113_0", "1526116_0", "1526117_0",
    "1526118_0", "1526119_0", "1526120_0",
  ].map((f) => `/pics/cars/van-10seats/${f}.jpg`),

  pickup: [
    "1528552_0", "1528553_0", "1528554_0", "1528555_0",
    "1528556_0", "1528557_0", "1528558_0",
  ].map((f) => `/pics/cars/truck/${f}.jpg`),
};

export default function Services({ dict }: { dict: Dictionary }) {
  return (
    <section id="services" className="bg-zinc-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-2xl">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">
            {dict.services.badge}
          </h2>
          <h3 className="mb-4 text-4xl font-bold text-secondary md:text-5xl">
            {dict.services.title}
          </h3>
          <p className="leading-relaxed text-zinc-500">{dict.services.subtitle}</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {dict.services.items.map((service) => {
            const images = carImages[service.id];
            const hasImages = images && images.length > 0;

            return (
              <div
                key={service.id}
                className="group overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl"
              >
                {hasImages && (
                  <ServiceCardCarousel
                    images={images}
                    alt={service.name}
                  />
                )}

                <div className="p-8">
                  {!hasImages && (
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      {serviceIcons[service.id]}
                    </div>
                  )}
                  <h4 className="mb-1 text-2xl font-bold text-secondary">
                    {service.name}
                  </h4>
                  <p className="mb-4 text-sm font-semibold text-primary">
                    {service.seats}
                  </p>
                  <p className="leading-relaxed text-zinc-500">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
