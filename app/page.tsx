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
        <div className="eyebrow">Teilprojekt PgB 1b</div>
        <h1>Making und Bildung für Nachhaltige Entwicklung</h1>
        <p className="lead">
          Die Produkte der Projektbeteiligten: was entstanden ist, wie es im Unterricht eingesetzt wurde
          und wo der Bezug zur Nachhaltigkeit liegt. Wähle eine Kachel, um die Produkte zu sehen.
        </p>
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
    </>
  );
}
