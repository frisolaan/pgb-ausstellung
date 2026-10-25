import { NextResponse } from "next/server";
import { checkCode, newId, saveEntry, type Entry } from "@/lib/entries";

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  const data = await request.json().catch(() => null);
  if (!data || !checkCode(data.code, "UPLOAD_CODE")) {
    return NextResponse.json({ error: "Zugangscode ist falsch." }, { status: 401 });
  }

  const title = str(data.title, 120);
  const presenter = str(data.presenter, 60);
  const group = str(data.group, 120);
  const summary = str(data.summary, 3000);
  if (!title || !presenter || !summary) {
    return NextResponse.json({ error: "Titel, Platzhaltername und Beschreibung sind Pflichtfelder." }, { status: 400 });
  }

  const blobHost = ".public.blob.vercel-storage.com/";
  const images = Array.isArray(data.images)
    ? data.images.filter((u: unknown) => typeof u === "string" && u.includes(blobHost)).slice(0, 10)
    : [];

  const files = Array.isArray(data.files)
    ? data.files
        .filter((f: { url?: unknown }) => typeof f?.url === "string" && (f.url as string).includes(blobHost))
        .slice(0, 10)
        .map((f: { url: string; name?: unknown; size?: unknown }) => ({
          url: f.url,
          name: str(f.name, 160) || "Dokument",
          size: typeof f.size === "number" ? f.size : 0,
        }))
    : [];

  let link = str(data.link, 400);
  if (link && !/^https?:\/\//i.test(link)) link = `https://${link}`;

  const entry: Entry = {
    id: newId(title),
    title,
    presenter,
    group,
    subject: str(data.subject, 120),
    summary,
    bne: str(data.bne, 800),
    link,
    images,
    files,
    createdAt: new Date().toISOString(),
  };

  await saveEntry(entry, "pending");
  return NextResponse.json({ ok: true });
}
