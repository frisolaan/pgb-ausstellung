import Link from "next/link";
import { groupByPresenter, listEntries } from "@/lib/entries";
import Avatar from "./avatar";

export const dynamic = "force-dynamic";

const PLACEHOLDERS = 3;
const PREVIEWS = ["/vorschau/a.svg", "/vorschau/b.svg", "/vorschau/c.svg"];

export default async function Home() {
  const entries = await listEntries("approved").catch(() => []);
  const presenters = groupByPresenter(entries);
  const kartenUrl = process.env.NEXT_PUBLIC_KARTEN_APP_URL;

  return (
    <>
      <section className="hero">
        <div className="eyebrow">Teilprojekt 1b · Rahmenprojekt PgB Nachhaltigkeit</div>
        <h1>Making und Bildung für Nachhaltige Entwicklung</h1>
        <div className="teaser">
          <p className="lead">
            Liebe Projektgruppe, hier entsteht unsere gemeinsame Ausstellung für die Synthesetagung vom
            28. Januar 2027 in Olten.
          </p>
          <p>
            Im Teilprojekt 1b habt ihr Unterrichtseinheiten entwickelt und erprobt, die Making und Bildung für
            Nachhaltige Entwicklung verbinden. Hier zeigt ihr eure Produkte: was entstanden ist, wie ihr es
            eingesetzt habt und wo der Bezug zur Nachhaltigkeit liegt.
          </p>
          <p>
            Unten rechts findet ihr mein Beispiel, das Kartenset «BNE meets Making». Nach diesem Vorbild können
            auch eure Produkte aufbereitet werden, als interaktive Anwendung, die sich direkt im Browser
            erkunden lässt. Ladet dazu über <Link href="/einreichen">Produkt einreichen</Link> eure Texte,
            Bilder und Unterlagen hoch. Ich bereite sie anschliessend auf.
          </p>
          <p className="meta">Die drei Platzhalter füllen sich mit euren Beiträgen. – Friso</p>
        </div>
      </section>

      <section className="grid two">
        {presenters.map((p, i) => (
          <Link key={p.slug} href={`/person/${p.slug}`} className="card person">
            {p.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="thumb" src={p.cover} alt="" loading="lazy" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="thumb" src={PREVIEWS[i % 3]} alt="" />
            )}
            <div className="body">
              <div className="who">
                <Avatar name={p.name} />
                <div>
                  <h3>{p.name}</h3>
                  <div className="meta">
                    {p.group ? `${p.group} · ` : ""}
                    {p.entries.length === 1 ? "1 Produkt" : `${p.entries.length} Produkte`}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
        {Array.from({ length: Math.max(0, PLACEHOLDERS - presenters.length) }, (_, i) => {
          const n = presenters.length + i;
          const label = `Platzhalter ${String.fromCharCode(65 + n)}`;
          return (
            <Link key={label} href="/einreichen" className="card placeholder">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="thumb" src={PREVIEWS[n % 3]} alt="" />
              <div className="body">
                <div className="who">
                  <Avatar name={label.replace("Platzhalter ", "")} />
                  <div>
                    <h3>{label}</h3>
                    <div className="meta">Produkt folgt</div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        {kartenUrl && (
          <a href={kartenUrl} target="_blank" rel="noopener noreferrer" className="card karten">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="thumb" src="/vorschau/karten.svg" alt="" />
            <div className="body">
              <div className="who">
                <Avatar name="Karten" />
                <div>
                  <h3>BNE meets Making</h3>
                  <div className="meta">Kartenset · App öffnen ↗</div>
                </div>
              </div>
            </div>
          </a>
        )}
      </section>

      <section className="indikatoren">
        <h2>Indikatoren: Making und BNE</h2>
        <p>
          Unsere gemeinsame Indikatorenliste zeigt, welche Punkte im Makingprozess Nachhaltigkeitskompetenzen
          fördern, wenn man sie bewusst steuert: von der Analyse der Materialeignung und der Produktfunktion
          über kollaboratives Tüfteln bis zur Beeinflussung des Nutzerverhaltens. Jedes Element lässt sich
          anklicken.
        </p>
        <div className="embed">
          <iframe
            src="https://prezi.com/p/embed/gtHzcGHanHKC2xsdWHLf/"
            title="Making BNE – Indikatoren (Prezi)"
            loading="lazy"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
        <p className="meta">
          <a href="https://prezi.com/view/gtHzcGHanHKC2xsdWHLf/" target="_blank" rel="noopener noreferrer">
            In Prezi öffnen ↗
          </a>
        </p>
      </section>
    </>
  );
}
