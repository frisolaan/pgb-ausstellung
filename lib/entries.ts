import { put, list, del } from "@vercel/blob";

export type Status = "pending" | "approved";

export type Entry = {
  id: string;
  title: string;
  group: string;
  contact: string;
  subject: string;
  summary: string;
  bne: string;
  link: string;
  images: string[];
  createdAt: string;
};

const prefix = (s: Status) => `entries/${s}/`;

async function readJson(url: string): Promise<Entry | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as Entry;
  } catch {
    return null;
  }
}

export async function listEntries(status: Status): Promise<Entry[]> {
  const out: Entry[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: prefix(status), cursor });
    const items = await Promise.all(page.blobs.map((b) => readJson(b.url)));
    for (const e of items) if (e) out.push(e);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getEntry(id: string, status: Status = "approved"): Promise<Entry | null> {
  if (!/^[a-z0-9-]+$/.test(id)) return null;
  const page = await list({ prefix: `${prefix(status)}${id}.json` });
  const blob = page.blobs[0];
  return blob ? readJson(blob.url) : null;
}

export async function saveEntry(entry: Entry, status: Status) {
  await put(`${prefix(status)}${entry.id}.json`, JSON.stringify(entry), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}

async function deleteEntryFile(id: string, status: Status) {
  const page = await list({ prefix: `${prefix(status)}${id}.json` });
  if (page.blobs.length) await del(page.blobs.map((b) => b.url));
}

export async function approve(id: string) {
  const entry = await getEntry(id, "pending");
  if (!entry) throw new Error("Eintrag nicht gefunden");
  await saveEntry(entry, "approved");
  await deleteEntryFile(id, "pending");
}

/** Entfernt einen Eintrag samt Bildern endgültig. */
export async function remove(id: string, status: Status) {
  const entry = await getEntry(id, status);
  if (entry?.images.length) await del(entry.images);
  await deleteEntryFile(id, status);
}

export function newId(title: string) {
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `${slug || "einheit"}-${Math.random().toString(36).slice(2, 7)}`;
}

export function checkCode(given: unknown, envName: "UPLOAD_CODE" | "ADMIN_CODE") {
  const expected = process.env[envName];
  return typeof given === "string" && !!expected && given.trim() === expected;
}
