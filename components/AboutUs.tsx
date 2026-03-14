import { Clock, ShieldCheck, MapPin, Award, Globe, Star } from "lucide-react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { SiteContent } from "@/lib/content";

const iconMap: Record<string, React.ReactNode> = {
  Clock: <Clock className="h-6 w-6" />,
  MapPin: <MapPin className="h-6 w-6" />,
  Shield: <ShieldCheck className="h-6 w-6" />,
  Globe: <Globe className="h-6 w-6" />,
  Award: <Award className="h-6 w-6" />,
  Star: <Star className="h-6 w-6" />,
};

const icons: Record<string, React.ReactNode> = {
  experience: <Clock className="h-6 w-6" />,
  trips: <Award className="h-6 w-6" />,
  availability: <ShieldCheck className="h-6 w-6" />,
  coverage: <MapPin className="h-6 w-6" />,
};

export default function AboutUs({ dict, content }: { dict: Dictionary; content?: SiteContent }) {
  const about = content?.about;
  const title = about?.title || dict.about.title;
  const description = about?.description || dict.about.description;

  const indicatorItems = about?.indicators
    ? about.indicators.map((ind) => ({
        key: ind.icon,
        icon: iconMap[ind.icon] || <Star className="h-6 w-6" />,
        value: ind.value,
        label: ind.label,
      }))
    : (Object.entries(dict.about.indicators) as [string, { value: string; label: string }][]).map(([key, item]) => ({
        key,
        icon: icons[key],
        value: item.value,
        label: item.label,
      }));

  return (
    <section id="about" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-2xl">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">
            {dict.about.badge}
          </h2>
          <h3 className="mb-6 text-4xl font-bold text-secondary md:text-5xl">
            {title}
          </h3>
          <p className="leading-relaxed text-zinc-500">
            {description}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {indicatorItems.map((item) => (
            <div
              key={item.key}
              className="group rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                {item.icon}
              </div>
              <div className="text-3xl font-bold text-secondary">
                {item.value}
              </div>
              <div className="text-sm text-zinc-500">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
