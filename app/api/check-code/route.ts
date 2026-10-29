import { NextResponse } from "next/server";
import { checkCode } from "@/lib/entries";

/** Prüft den Zugangscode, bevor das Formular Dateien hochlädt. */
export async function POST(request: Request) {
  const data = await request.json().catch(() => null);
  if (!data || !checkCode(data.code, "UPLOAD_CODE")) {
    return NextResponse.json({ error: "Zugangscode ist falsch." }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
