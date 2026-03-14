import { getDictionary, type Lang } from "./dictionaries";
import { getContent, type SiteContent } from "@/lib/content";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import PerformanceGallery from "@/components/PerformanceGallery";
import Services from "@/components/Services";
import ServiceAreas from "@/components/ServiceAreas";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";

const supportedLangs = new Set<string>(["th", "en"]);

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: Lang = supportedLangs.has(rawLang) ? (rawLang as Lang) : "th";
  const dict = await getDictionary(lang);
  const content = getContent(lang);

  return (
    <>
      <Header dict={dict} lang={lang} content={content} />
      <main>
        <Hero dict={dict} content={content} />
        <AboutUs dict={dict} content={content} />
        <Services dict={dict} content={content} />
        <PerformanceGallery dict={dict} content={content} />
        <ServiceAreas dict={dict} content={content} />
        <ContactForm dict={dict} lang={lang} content={content} />
      </main>
      <Footer dict={dict} content={content} />
      <FloatingButtons content={content} />
    </>
  );
}
