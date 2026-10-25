import Link from "next/link";
import { listEntries } from "@/lib/entries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const entries = await listEntries("approved").catch(() => []);
  const kartenUrl = process.env.NEXT_PUBLIC_KARTEN_APP_URL;

  return (
    <>
      <section className="hero">
        <div className="eyebrow">Teilprojekt PgB 1b</div>
        <h1>Making und Bildung für Nachhaltige Entwicklung</h1>
        <p className="lead">
          Unterrichtseinheiten und Artefakte aus dem Projekt: was entstanden ist, wie es im Unterricht
          eingesetzt wurde und wo der Bezug zur Nachhaltigkeit liegt.
        </p>
      </section>

      {kartenUrl && (
        <section className="feature">
          <div>
            <h2>BNE × Making – die Karten</h2>
            <p>Impulskarten, die Making-Aktivitäten mit Fragen der Nachhaltigkeit verbinden. Direkt im Browser ausprobieren.</p>
          </div>
          <a className="btn" href={kartenUrl} target="_blank" rel="noopener noreferrer">
            Karten öffnen
          </a>
        </section>
      )}

      {entries.length === 0 ? (
        <div className="empty" style={{ marginBottom: 56 }}>
          Hier erscheinen bald die Einheiten der Projektgruppen.
          <br />
          <Link href="/einreichen">Eigene Einheit einreichen →</Link>
        </div>
      ) : (
        <section className="grid">
          {entries.map((e) => (
            <Link key={e.id} href={`/einheit/${e.id}`} className="card">
              {e.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="thumb" src={e.images[0]} alt="" loading="lazy" />
              ) : (
                <div className="thumb" />
              )}
              <div className="body">
                <h3>{e.title}</h3>
                <div className="meta">
                  {e.group}
                  {e.subject ? ` · ${e.subject}` : ""}
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}
    </>
  );
}
