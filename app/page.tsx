import Link from "next/link";
import { groupByPresenter, listEntries } from "@/lib/entries";
import Avatar from "./avatar";

export const dynamic = "force-dynamic";

const SLOTS = 4;

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

      {kartenUrl && (
        <section className="feature">
          <div>
            <h2>BNE × Making – die Karten</h2>
            <p>Die Karten zum Projekt direkt im Browser ausprobieren.</p>
          </div>
          <a className="btn" href={kartenUrl} target="_blank" rel="noopener noreferrer">
            Karten öffnen
          </a>
        </section>
      )}

      <section className="grid two">
        {presenters.map((p) => (
          <Link key={p.slug} href={`/person/${p.slug}`} className="card person">
            {p.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="thumb" src={p.cover} alt="" loading="lazy" />
            ) : (
              <div className="thumb" />
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
        {Array.from({ length: Math.max(0, SLOTS - presenters.length) }, (_, i) => {
          const label = `Team ${String.fromCharCode(65 + presenters.length + i)}`;
          return (
            <Link key={label} href="/einreichen" className="card placeholder">
              <div className="thumb ph">
                <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
                  <path
                    d="M4 5h16v14H4zM4 15l4.5-4.5 4 4 3-3L20 15M15 9.5a1.5 1.5 0 1 0 0-.01"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="body">
                <div className="who">
                  <Avatar name={label} />
                  <div>
                    <h3>{label}</h3>
                    <div className="meta">Produkt folgt</div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </>
  );
}
