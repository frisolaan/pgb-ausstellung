import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntry, presenterSlug } from "@/lib/entries";

export const dynamic = "force-dynamic";

export default async function EntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = await getEntry(id);
  if (!e) notFound();

  return (
    <article className="detail">
      <Link href={`/person/${presenterSlug(e.presenter || e.group || "Ohne Namen")}`}>
        ← {e.presenter || e.group}
      </Link>
      <div className="eyebrow" style={{ marginTop: 24 }}>
        {[e.presenter, e.group, e.subject].filter(Boolean).join(" · ")}
      </div>
      <h1>{e.title}</h1>
      <p className="lead prewrap">{e.summary}</p>

      {e.images.length > 0 && (
        <div className="gallery">
          {e.images.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" loading="lazy" />
          ))}
        </div>
      )}

      {e.files && e.files.length > 0 && (
        <div className="box">
          <h2>Dokumente</h2>
          <ul className="files">
            {e.files.map((f) => (
              <li key={f.url}>
                <a href={f.url} target="_blank" rel="noopener noreferrer" download={f.name}>
                  <span className="ext">{(f.name.split(".").pop() || "").toUpperCase().slice(0, 4)}</span>
                  <span className="fname">{f.name}</span>
                  {f.size > 0 && <span className="meta">{(f.size / 1024 / 1024).toFixed(1)} MB</span>}
                </a>
              </li>
            ))}
          </ul>
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
