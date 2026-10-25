"use client";

import { useState } from "react";
import type { Entry } from "@/lib/entries";

type Lists = { pending: Entry[]; approved: Entry[] };

export default function Admin() {
  const [code, setCode] = useState("");
  const [lists, setLists] = useState<Lists | null>(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  async function call(action: string, id?: string) {
    setError("");
    setBusy(id || action);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, action, id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Fehler.");
      if (action === "list") setLists(data);
      else await call("list");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler.");
    } finally {
      setBusy("");
    }
  }

  if (!lists) {
    return (
      <form
        className="stack"
        style={{ paddingTop: 40 }}
        onSubmit={(e) => {
          e.preventDefault();
          call("list");
        }}
      >
        <h1>Freigabe</h1>
        <label>
          Admin-Code
          <input type="password" value={code} onChange={(e) => setCode(e.target.value)} required />
        </label>
        {error && <p className="error">{error}</p>}
        <div>
          <button className="btn" disabled={!!busy}>Anmelden</button>
        </div>
      </form>
    );
  }

  const item = (e: Entry, pending: boolean) => (
    <div className="admin-item" key={e.id}>
      {e.images[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={e.images[0]} alt="" />
      ) : (
        <div />
      )}
      <div>
        <strong>{e.title}</strong>
        <div className="meta">
          {[e.presenter, e.group].filter(Boolean).join(" · ")} · {new Date(e.createdAt).toLocaleString("de-CH")} · {e.images.length} Bild(er)
        </div>
        <p style={{ margin: "6px 0 0" }} className="prewrap">{e.summary}</p>
        <div className="actions">
          {pending ? (
            <>
              <button className="btn" disabled={!!busy} onClick={() => call("approve", e.id)}>Freigeben</button>
              <button
                className="btn danger"
                disabled={!!busy}
                onClick={() => confirm("Einreichung samt Bildern endgültig löschen?") && call("reject", e.id)}
              >
                Ablehnen und löschen
              </button>
            </>
          ) : (
            <>
              <a className="btn secondary" href={`/einheit/${e.id}`} target="_blank">Ansehen</a>
              <button
                className="btn danger"
                disabled={!!busy}
                onClick={() => confirm("Eintrag samt Bildern endgültig aus der Ausstellung löschen?") && call("unpublish", e.id)}
              >
                Löschen
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "36px 0 64px" }}>
      <h1>Freigabe</h1>
      {error && <p className="error">{error}</p>}
      <h2>Wartet auf Freigabe ({lists.pending.length})</h2>
      {lists.pending.length ? lists.pending.map((e) => item(e, true)) : <p className="meta">Keine offenen Einreichungen.</p>}
      <h2 style={{ marginTop: 36 }}>In der Ausstellung ({lists.approved.length})</h2>
      {lists.approved.length ? lists.approved.map((e) => item(e, false)) : <p className="meta">Noch nichts freigegeben.</p>}
    </div>
  );
}
