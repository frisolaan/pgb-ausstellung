import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { approve, checkCode, listEntries, remove } from "@/lib/entries";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const data = await request.json().catch(() => null);
  if (!data || !checkCode(data.code, "ADMIN_CODE")) {
    return NextResponse.json({ error: "Admin-Code ist falsch." }, { status: 401 });
  }

  try {
    switch (data.action) {
      case "list":
        return NextResponse.json({
          pending: await listEntries("pending"),
          approved: await listEntries("approved"),
        });
      case "approve":
        await approve(String(data.id));
        break;
      case "reject":
        await remove(String(data.id), "pending");
        break;
      case "unpublish":
        await remove(String(data.id), "approved");
        break;
      default:
        return NextResponse.json({ error: "Unbekannte Aktion." }, { status: 400 });
    }
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Fehler." },
      { status: 500 },
    );
  }
}
