import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getDictionary, type Lang } from "./dictionaries";
import { getContent } from "@/lib/content";

const supportedLangs = new Set<string>(["th", "en"]);

function toLang(s: string): Lang {
  return supportedLangs.has(s) ? (s as Lang) : "th";
}

export async function generateStaticParams() {
  return [{ lang: "th" }, { lang: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = toLang(rawLang);
  const dict = await getDictionary(lang);
  const content = getContent(lang);
  const baseUrl = "https://ochatravel.co.th";

  const title = content.seo?.title || dict.meta.title;
  const description = content.seo?.description || dict.meta.description;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: { th: `${baseUrl}/th`, en: `${baseUrl}/en` },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}`,
      siteName: content.settings?.businessName || "Ocha Travel Transport",
      locale: lang === "th" ? "th_TH" : "en_US",
      type: "website",
      images: [{ url: content.seo?.ogImage ? `${baseUrl}${content.seo.ogImage}` : `${baseUrl}/logos/Ocha-Full-2_0.png`, width: 1200, height: 630 }],
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = toLang(rawLang);
  const dict = await getDictionary(lang);
  const content = getContent(lang);
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: content.settings?.businessName || "Ocha Travel Transport",
    description: content.seo?.description || dict.meta.description,
    telephone: content.contact?.phone ? `+66${content.contact.phone.slice(1)}` : "+66661244999",
    address: {
      "@type": "PostalAddress",
      streetAddress: "168/284 Moo 3",
      addressLocality: "Pathum Thani",
      postalCode: "12000",
      addressCountry: "TH",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    areaServed: { "@type": "Country", name: "Thailand" },
    url: "https://ochatravel.co.th",
  };

  return (
    <div lang={lang} className="bg-white text-secondary selection:bg-primary/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </div>
  );
}
