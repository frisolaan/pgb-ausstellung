import { NextResponse } from "next/server";
import { checkCode, newId, saveEntry, type Entry } from "@/lib/entries";

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  const data = await request.json().catch(() => null);
  if (!data || !checkCode(data.code, "UPLOAD_CODE")) {
    return NextResponse.json({ error: "Zugangscode ist falsch." }, { status: 401 });
  }

  const title = str(data.title, 120);
  const group = str(data.group, 120);
  const summary = str(data.summary, 1500);
  if (!title || !group || !summary) {
    return NextResponse.json({ error: "Titel, Gruppe und Beschreibung sind Pflichtfelder." }, { status: 400 });
  }

  const blobHost = ".public.blob.vercel-storage.com/";
  const images = Array.isArray(data.images)
    ? data.images.filter((u: unknown) => typeof u === "string" && u.includes(blobHost)).slice(0, 6)
    : [];

  let link = str(data.link, 400);
  if (link && !/^https?:\/\//i.test(link)) link = `https://${link}`;

  const entry: Entry = {
    id: newId(title),
    title,
    group,
    contact: str(data.contact, 120),
    subject: str(data.subject, 120),
    summary,
    bne: str(data.bne, 800),
    link,
    images,
    createdAt: new Date().toISOString(),
  };

  await saveEntry(entry, "pending");
  return NextResponse.json({ ok: true });
}
