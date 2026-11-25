import data from "./indikatoren.json";

export type Stufe = "deutlich" | "teilweise" | "offen";
export type ProduktKey = "smart-plants" | "pumpspeicher" | "solar";

export type Stelle = { wo: string; was: string; href?: string };
export type Fundstelle = { stufe: Stufe; stellen: Stelle[]; hinweis?: string };

export type Indikator = {
  slug: string;
  titel: string;
  text: string;
  beispiele: string[];
  beispieleHinweis?: string;
  fundstellen: Record<ProduktKey, Fundstelle>;
};

export type Produkt = { name: string; url: string; kurz: string; extern?: boolean };

export const QUELLE = data.quelle;
export const PRODUKTE = data.produkte as Record<ProduktKey, Produkt>;
export const PRODUKT_KEYS = Object.keys(PRODUKTE) as ProduktKey[];
export const STUFEN = data.stufen as Record<Stufe, string>;
export const INDIKATOREN = data.indikatoren as Indikator[];

export function indikator(slug: string) {
  return INDIKATOREN.find((i) => i.slug === slug);
}

/** Link auf eine Fundstelle: Sprungmarke in der Produktseite oder Produkt als Ganzes. */
export function stelleHref(key: ProduktKey, s: Stelle) {
  const p = PRODUKTE[key];
  return s.href && !p.extern ? `${p.url}${s.href}` : p.url;
}
