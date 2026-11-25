/** Aufbereitete Lerneinheiten (statische Seiten unter public/produkte) zu eingereichten Einträgen. */
export const PRODUKTSEITEN: Record<string, { url: string; stand: string; titel?: string }> = {
  "smart-plants-ak81a": { url: "/produkte/smart-plants", stand: "Entwurf zur Diskussion" },
  "pumpspiecherkraftwerk-5mac6": {
    url: "/produkte/pumpspeicherkraftwerk",
    stand: "Entwurf zur Diskussion",
    titel: "Pumpspeicherkraftwerk",
  },
};

export function produktseite(id: string) {
  return PRODUKTSEITEN[id];
}

/** Anzeigetitel: korrigierter Titel, falls in der Einreichung ein Tippfehler steht. */
export function anzeigetitel(e: { id: string; title: string }) {
  return PRODUKTSEITEN[e.id]?.titel ?? e.title;
}
