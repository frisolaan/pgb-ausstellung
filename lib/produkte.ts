/**
 * Aufbereitete Produkte: Zuordnung Eintrag (ID aus der Einreichung) → Produktseite.
 * Die Seiten liegen statisch unter public/produkte/<name>/.
 */
export const PRODUKTSEITEN: Record<string, { url: string; stand: string }> = {
  "smart-plants-ak81a": { url: "/produkte/smart-plants", stand: "Entwurf zur Diskussion" },
};

export function produktseite(id: string) {
  return PRODUKTSEITEN[id];
}
