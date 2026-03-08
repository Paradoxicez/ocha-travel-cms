import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getDictionary, type Lang } from "./dictionaries";
import "@/app/globals.css";

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
  const baseUrl = "https://ochatravel.co.th";

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: { th: `${baseUrl}/th`, en: `${baseUrl}/en` },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: `${baseUrl}/${lang}`,
      siteName: "Ocha Travel Transport",
      locale: lang === "th" ? "th_TH" : "en_US",
      type: "website",
      images: [{ url: `${baseUrl}/logos/Ocha-Full-2_0.png`, width: 1200, height: 630 }],
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
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Ocha Travel Transport",
    description: dict.meta.description,
    telephone: "+66661244999",
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
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800&family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-white text-secondary antialiased selection:bg-primary/30">
        {children}
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
