import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { INDIKATOREN, PRODUKTE, PRODUKT_KEYS, QUELLE, indikator, stelleHref } from "@/lib/indikatoren";
import EntwurfHinweis from "../entwurf";
import StufeBadge from "../stufe";

export function generateStaticParams() {
  return INDIKATOREN.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const ind = indikator((await params).slug);
  return { title: ind ? `${ind.titel} – Making × BNE` : "Indikator – Making × BNE" };
}

export default async function IndikatorSeite({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = indikator(slug);
  if (!ind) notFound();
  const n = INDIKATOREN.indexOf(ind);
  const prev = INDIKATOREN[n - 1];
  const next = INDIKATOREN[n + 1];

  return (
    <article className="seite indikator">
      <Link href="/">← Zur Ausstellung</Link>
      <div className="eyebrow" style={{ marginTop: 24 }}>
        Indikator {n + 1} von {INDIKATOREN.length}
      </div>
      <h1>{ind.titel}</h1>
      <p className="lead">{ind.text}</p>

      <h2 className="abschnitt">Wo findet sich der Indikator?</h2>
      <EntwurfHinweis />
      <div className="fund-liste">
        {PRODUKT_KEYS.map((k) => {
          const p = PRODUKTE[k];
          const f = ind.fundstellen[k];
          return (
            <section key={k} className={`fund ${f.stufe}`}>
              <header>
                <h3>
                  <a href={p.url} {...(p.extern ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    {p.name}
                    {p.extern ? " ↗" : ""}
                  </a>
                </h3>
                <StufeBadge stufe={f.stufe} />
              </header>
              <p className="meta kurz">{p.kurz}</p>
              {f.stellen.length > 0 && (
                <ul>
                  {f.stellen.map((s) => (
                    <li key={s.wo + s.was}>
                      <a
                        href={stelleHref(k, s)}
                        {...(p.extern ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {s.wo}
                      </a>
                      <span>{s.was}</span>
                    </li>
                  ))}
                </ul>
              )}
              {f.hinweis && <p className="hinweis">{f.hinweis}</p>}
              {p.extern && f.stellen.length > 0 && (
                <p className="meta klein">Die App hat keine Direktlinks auf einzelne Phasen.</p>
              )}
            </section>
          );
        })}
      </div>

      <h2 className="abschnitt">Zum Beispiel</h2>
      {ind.beispiele.length > 0 && (
        <ul className="beispiele">
          {ind.beispiele.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
      {ind.beispieleHinweis && <p className="meta">{ind.beispieleHinweis}</p>}
      <p className="meta">
        Aus der Indikatorenliste von {QUELLE.autorin} (<a href={QUELLE.prezi} target="_blank" rel="noopener noreferrer">Prezi</a>).
      </p>

      <nav className="blaettern" aria-label="Weitere Indikatoren">
        {prev ? <Link href={`/indikatoren/${prev.slug}`}>← {prev.titel}</Link> : <span />}
        <Link href="/indikatoren">Übersicht</Link>
        {next ? <Link href={`/indikatoren/${next.slug}`}>{next.titel} →</Link> : <span />}
      </nav>
    </article>
  );
}
