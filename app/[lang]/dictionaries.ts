import type thDict from "@/dictionaries/th.json";

export type Dictionary = typeof thDict;
export type Lang = "th" | "en";

const dictionaries: Record<Lang, () => Promise<Dictionary>> = {
  th: () => import("@/dictionaries/th.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
};

export async function getDictionary(lang: Lang): Promise<Dictionary> {
  return dictionaries[lang]();
}
