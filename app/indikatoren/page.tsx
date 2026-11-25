import type { Metadata } from "next";
import Link from "next/link";
import { INDIKATOREN, PRODUKTE, PRODUKT_KEYS, QUELLE } from "@/lib/indikatoren";
import EntwurfHinweis from "./entwurf";
import StufeBadge from "./stufe";

export const metadata: Metadata = { title: "Indikatoren – Making × BNE" };

export default function IndikatorenUebersicht() {
  return (
    <div className="seite">
      <Link href="/">← Zur Ausstellung</Link>
      <div className="eyebrow" style={{ marginTop: 24 }}>Indikatoren Making × BNE</div>
      <h1>Sieben Indikatoren in drei Unterrichtseinheiten</h1>
      <p className="lead">{QUELLE.leitsatz}</p>
      <EntwurfHinweis />

      <div className="tabelle-wrap">
        <table className="matrix">
          <thead>
            <tr>
              <th scope="col">Indikator</th>
              {PRODUKT_KEYS.map((k) => (
                <th key={k} scope="col">{PRODUKTE[k].name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INDIKATOREN.map((ind, i) => (
              <tr key={ind.slug}>
                <th scope="row">
                  <Link href={`/indikatoren/${ind.slug}`}>
                    <span className="nr">{i + 1}</span> {ind.titel}
                  </Link>
                </th>
                {PRODUKT_KEYS.map((k) => {
                  const f = ind.fundstellen[k];
                  return (
                    <td key={k}>
                      <StufeBadge stufe={f.stufe} />
                      {f.stellen.length > 0 && (
                        <span className="wo">{f.stellen.map((s) => s.wo).join(" · ")}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="meta">
        Das Kartenset «BNE meets Making» ist ein Werkzeug zur Selbstdiagnose von Lehrpersonen und keine
        Unterrichtseinheit; es ist deshalb nicht zugeordnet.
      </p>

      <h2 className="abschnitt">Die Indikatoren im Original</h2>
      <p className="meta" style={{ marginTop: 0 }}>
        Prezi «{QUELLE.titel}» von {QUELLE.autorin}. Jedes Element lässt sich anklicken.
      </p>
      <div className="embed">
        <iframe
          src={QUELLE.embed}
          title="Making BNE – Indikatoren (Prezi)"
          loading="lazy"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>
      <p className="meta">
        <a href={QUELLE.prezi} target="_blank" rel="noopener noreferrer">In Prezi öffnen ↗</a>
      </p>
    </div>
  );
}
