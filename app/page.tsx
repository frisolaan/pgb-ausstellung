import Link from "next/link";
import { groupByPresenter, listEntries } from "@/lib/entries";
import Avatar from "./avatar";

export const dynamic = "force-dynamic";

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

      {presenters.length === 0 ? (
        <div className="empty" style={{ marginBottom: 56 }}>
          Hier erscheinen bald die Produkte der Projektbeteiligten.
          <br />
          <Link href="/einreichen">Eigenes Produkt einreichen →</Link>
        </div>
      ) : (
        <section className="grid">
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
        </section>
      )}
    </>
  );
}
