import { getDictionary, type Lang } from "./dictionaries";
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

  return (
    <>
      <Header dict={dict} lang={lang} />
      <main>
        <Hero dict={dict} />
        <AboutUs dict={dict} />
        <Services dict={dict} />
        <PerformanceGallery dict={dict} />
        <ServiceAreas dict={dict} />
        <ContactForm dict={dict} lang={lang} />
      </main>
      <Footer dict={dict} />
      <FloatingButtons />
    </>
  );
}
