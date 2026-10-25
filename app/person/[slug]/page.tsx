import Link from "next/link";
import { notFound } from "next/navigation";
import { groupByPresenter, listEntries } from "@/lib/entries";
import Avatar from "../../avatar";

export const dynamic = "force-dynamic";

export default async function PersonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entries = await listEntries("approved").catch(() => []);
  const p = groupByPresenter(entries).find((x) => x.slug === slug);
  if (!p) notFound();

  return (
    <div style={{ padding: "36px 0 0" }}>
      <Link href="/">← Zur Ausstellung</Link>
      <div className="who" style={{ margin: "24px 0 8px" }}>
        <Avatar name={p.name} size={64} />
        <div>
          <h1 style={{ margin: 0 }}>{p.name}</h1>
          {p.group && <div className="meta">{p.group}</div>}
        </div>
      </div>
      <p className="lead" style={{ marginBottom: 28 }}>
        {p.entries.length === 1 ? "1 Produkt" : `${p.entries.length} Produkte`}
      </p>
      <section className="grid">
        {p.entries.map((e) => (
          <Link key={e.id} href={`/einheit/${e.id}`} className="card">
            {e.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="thumb" src={e.images[0]} alt="" loading="lazy" />
            ) : (
              <div className="thumb" />
            )}
            <div className="body">
              <h3>{e.title}</h3>
              {e.subject && <div className="meta">{e.subject}</div>}
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
