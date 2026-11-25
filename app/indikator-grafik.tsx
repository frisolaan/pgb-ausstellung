import Link from "next/link";
import { INDIKATOREN, PRODUKTE, PRODUKT_KEYS, QUELLE, STUFEN } from "@/lib/indikatoren";

/** Zahnrad als dekoratives Element, angelehnt an die Prezi-Grafik. */
function Zahnrad({ className }: { className: string }) {
  const teeth = Array.from({ length: 10 }, (_, i) => i * 36);
  return (
    <svg className={`zahnrad ${className}`} viewBox="-50 -50 100 100" aria-hidden="true">
      {teeth.map((a) => (
        <rect key={a} x="-7" y="-48" width="14" height="16" rx="3" transform={`rotate(${a})`} />
      ))}
      <circle r="36" />
      <circle r="20" className="loch" />
    </svg>
  );
}

export default function IndikatorGrafik() {
  return (
    <section className="anker" aria-labelledby="h-anker">
      <div className="anker-kopf">
        <div className="eyebrow">Gemeinsamer Rahmen</div>
        <h2 id="h-anker">Making BNE</h2>
        <p className="leitsatz">{QUELLE.leitsatz}</p>
      </div>

      <ol className="kreise">
        {INDIKATOREN.map((ind, i) => (
          <li key={ind.slug} className={`kreis k${i + 1}`}>
            <Link href={`/indikatoren/${ind.slug}`}>
              <span className="nr">{i + 1}</span>
              <span className="titel">{ind.titel}</span>
              <span className="punkte" aria-label="Vorkommen in den Produkten">
                {PRODUKT_KEYS.map((k) => {
                  const s = ind.fundstellen[k].stufe;
                  return (
                    <span
                      key={k}
                      className={`punkt ${s}`}
                      title={`${PRODUKTE[k].name}: ${STUFEN[s]}`}
                      aria-label={`${PRODUKTE[k].name}: ${STUFEN[s]}`}
                    />
                  );
                })}
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <Zahnrad className="z1" />
      <Zahnrad className="z2" />
      <Zahnrad className="z3" />

      <div className="anker-fuss">
        <p className="legende">
          Punkte je Kreis: {PRODUKT_KEYS.map((k) => PRODUKTE[k].name).join(" · ")}
          <span><i className="punkt deutlich" /> ausdrücklich</span>
          <span><i className="punkt teilweise" /> teilweise</span>
          <span><i className="punkt offen" /> nicht ausgewiesen</span>
        </p>
        <p className="meta">
          Indikatoren nach Anja Küttel ·{" "}
          <Link href="/indikatoren">Alle Indikatoren als Übersicht →</Link>
        </p>
      </div>
    </section>
  );
}
