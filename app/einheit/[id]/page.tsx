import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntry, presenterSlug } from "@/lib/entries";
import { anzeigetitel, produktseite } from "@/lib/produkte";

export const dynamic = "force-dynamic";

export default async function EntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = await getEntry(id);
  if (!e) notFound();
  const seite = produktseite(e.id);

  return (
    <article className="detail">
      <Link href={`/person/${presenterSlug(e.presenter || e.group || "Ohne Namen")}`}>
        ← {e.presenter || e.group}
      </Link>
      <div className="eyebrow" style={{ marginTop: 24 }}>
        {[e.presenter, e.group, e.subject].filter(Boolean).join(" · ")}
      </div>
      <h1>{anzeigetitel(e)}</h1>
      <p className="lead prewrap">{e.summary}</p>

      {seite && (
        <div className="box produkt">
          <div>
            <h2>Aufbereitete Lerneinheit</h2>
            <p className="meta" style={{ margin: 0 }}>{seite.stand}</p>
          </div>
          <a className="btn" href={seite.url}>Lerneinheit öffnen →</a>
        </div>
      )}

      {e.images.length > 0 && (
        <div className="gallery">
          {e.images.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" loading="lazy" />
          ))}
        </div>
      )}

      {e.bne && (
        <div className="box">
          <h2>Bezug zu BNE</h2>
          <div className="prewrap">{e.bne}</div>
        </div>
      )}

      {e.link && (
        <div className="box">
          <a href={e.link} target="_blank" rel="noopener noreferrer">
            Material und weitere Informationen →
          </a>
        </div>
      )}
    </article>
  );
}
