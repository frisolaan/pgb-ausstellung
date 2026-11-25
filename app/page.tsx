import Link from "next/link";
import { listEntries } from "@/lib/entries";
import { anzeigetitel, produktseite } from "@/lib/produkte";
import Avatar from "./avatar";
import IndikatorGrafik from "./indikator-grafik";

export const dynamic = "force-dynamic";

const PREVIEWS = ["/vorschau/a.svg", "/vorschau/b.svg", "/vorschau/c.svg"];
const SOLAR_URL = "https://magenta-platypus-93095a.netlify.app/";

export default async function Home() {
  const entries = await listEntries("approved").catch(() => []);
  // Reihenfolge der Einreichung, keine Rangierung
  const produkte = [...entries].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const kartenUrl = process.env.NEXT_PUBLIC_KARTEN_APP_URL;

  return (
    <>
      <section className="hero">
        <div className="eyebrow">Teilprojekt 1b · Rahmenprojekt PgB Nachhaltigkeit</div>
        <h1>Making und Bildung für Nachhaltige Entwicklung</h1>
        <div className="teaser">
          <p className="lead">
            Vier Produkte aus dem Teilprojekt 1b zeigen, wie Making und Bildung für Nachhaltige Entwicklung (BNE) in
            der Ausbildung von Lehrpersonen zusammenkommen.
          </p>
          <p>
            Den gemeinsamen Rahmen bilden sieben Indikatoren: Punkte im Makingprozess, an denen Nachhaltigkeits­kompetenzen
            gefördert werden, wenn man sie bewusst steuert. Wählt einen Indikator, um zu sehen, an welcher Stelle er in
            den Unterrichtseinheiten vorkommt, oder öffnet direkt ein Produkt.
          </p>
        </div>
      </section>

      <IndikatorGrafik />

      <section aria-labelledby="h-produkte">
        <h2 id="h-produkte" className="abschnitt">Produkte</h2>
        <div className="grid two">
          {produkte.map((e, i) => {
            const seite = produktseite(e.id);
            const href = seite?.url ?? `/einheit/${e.id}`;
            const wer = [e.presenter, e.group].filter(Boolean).join(" · ");
            return (
              <a key={e.id} href={href} className="card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="thumb" src={e.images[0] ?? PREVIEWS[i % 3]} alt="" loading="lazy" />
                <div className="body">
                  <div className="who">
                    <Avatar name={anzeigetitel(e)} />
                    <div>
                      <h3>{anzeigetitel(e)}</h3>
                      <div className="meta">{wer || "Lerneinheit"}</div>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}

          <a href={SOLAR_URL} target="_blank" rel="noopener noreferrer" className="card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="thumb" src="/vorschau/solar.svg" alt="" />
            <div className="body">
              <div className="who">
                <Avatar name="Solar Tracking" />
                <div>
                  <h3>Solar-Tracking</h3>
                  <div className="meta">MINT &amp; BNE in neun Phasen · App öffnen ↗</div>
                </div>
              </div>
            </div>
          </a>

          {kartenUrl && (
            <a href={kartenUrl} target="_blank" rel="noopener noreferrer" className="card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="thumb" src="/vorschau/karten.svg" alt="" />
              <div className="body">
                <div className="who">
                  <Avatar name="Karten" />
                  <div>
                    <h3>BNE meets Making</h3>
                    <div className="meta">Kartenset zur Selbstdiagnose · App öffnen ↗</div>
                  </div>
                </div>
              </div>
            </a>
          )}
        </div>
      </section>

      <section className="projektgruppe">
        <p className="meta">
          Für die Projektgruppe: Material ergänzen oder ein weiteres Produkt einreichen unter{" "}
          <Link href="/einreichen">Produkt einreichen</Link>.
        </p>
      </section>
    </>
  );
}
