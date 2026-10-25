"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";

type Phase = "form" | "sending" | "done";

export default function Submit() {
  const [phase, setPhase] = useState<Phase>("form");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setError("");
    const form = new FormData(ev.currentTarget);
    const code = String(form.get("code") || "");
    const files = (form.getAll("images") as File[]).filter((f) => f && f.size > 0).slice(0, 6);

    if (files.some((f) => f.size > 10 * 1024 * 1024)) {
      setError("Ein Bild ist grösser als 10 MB. Bitte verkleinern.");
      return;
    }

    setPhase("sending");
    try {
      const urls: string[] = [];
      for (const [i, file] of files.entries()) {
        setProgress(`Bild ${i + 1} von ${files.length} wird hochgeladen …`);
        const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
        const blob = await upload(`uploads/${safe}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
          clientPayload: code,
        });
        urls.push(blob.url);
      }

      setProgress("Angaben werden gespeichert …");
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          title: form.get("title"),
          group: form.get("group"),
          contact: form.get("contact"),
          subject: form.get("subject"),
          summary: form.get("summary"),
          bne: form.get("bne"),
          link: form.get("link"),
          images: urls,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Speichern fehlgeschlagen.");
      setPhase("done");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unbekannter Fehler.";
      setError(msg.includes("Zugangscode") ? "Der Zugangscode ist falsch." : msg);
      setPhase("form");
    } finally {
      setProgress("");
    }
  }

  if (phase === "done") {
    return (
      <section className="hero">
        <h1>Danke!</h1>
        <p className="lead">
          Eure Einheit ist eingegangen. Sie erscheint in der Ausstellung, sobald sie freigegeben ist.
        </p>
        <p>
          <button className="btn secondary" onClick={() => setPhase("form")}>Weitere Einheit einreichen</button>
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="hero" style={{ paddingBottom: 12 }}>
        <div className="eyebrow">Für die Projektgruppen</div>
        <h1>Einheit einreichen</h1>
        <div className="notice">
          <strong>So geht&apos;s</strong>
          <ol className="steps">
            <li>Zugangscode eingeben (steht in der Mail an die Projektgruppe).</li>
            <li>Titel, Gruppe und eine kurze Beschreibung eurer Einheit ausfüllen.</li>
            <li>Bis zu 6 Fotos von Artefakten oder aus dem Unterricht hochladen (je max. 10 MB).</li>
            <li>Absenden. Nach der Freigabe erscheint die Einheit in der Ausstellung.</li>
          </ol>
        </div>
      </section>

      <form className="stack" onSubmit={onSubmit}>
        <label>
          Zugangscode
          <input type="password" name="code" required autoComplete="off" />
        </label>
        <label>
          Titel der Einheit
          <input type="text" name="title" required maxLength={120} placeholder="z. B. Smartplants" />
        </label>
        <label>
          Gruppe / Hochschule
          <input type="text" name="group" required maxLength={120} placeholder="z. B. PH Graubünden" />
        </label>
        <label>
          Fach oder Bereich <small>optional</small>
          <input type="text" name="subject" maxLength={120} placeholder="z. B. NMG / Informatik" />
        </label>
        <label>
          Kurzbeschreibung
          <small>Worum geht es, was haben die Schülerinnen und Schüler gemacht?</small>
          <textarea name="summary" required maxLength={1500} />
        </label>
        <label>
          Bezug zu BNE <small>optional</small>
          <textarea name="bne" maxLength={800} />
        </label>
        <label>
          Link zu Material <small>optional, z. B. Unterrichtsmaterial oder Video</small>
          <input type="text" name="link" maxLength={400} placeholder="https://…" />
        </label>
        <label>
          Kontaktperson <small>optional, wird öffentlich angezeigt</small>
          <input type="text" name="contact" maxLength={120} />
        </label>
        <label>
          Fotos <small>bis zu 6 Bilder (JPG, PNG, WebP)</small>
          <input type="file" name="images" accept="image/jpeg,image/png,image/webp,image/gif" multiple />
        </label>
        <label className="check">
          <input type="checkbox" required />
          <span>
            Ich bestätige, dass die Bilder veröffentlicht werden dürfen. Auf Fotos erkennbare Personen,
            insbesondere Schülerinnen und Schüler, haben eingewilligt.
          </span>
        </label>

        {error && <p className="error">{error}</p>}
        {progress && <p className="meta">{progress}</p>}
        <div>
          <button className="btn" type="submit" disabled={phase === "sending"}>
            {phase === "sending" ? "Wird gesendet …" : "Einheit absenden"}
          </button>
        </div>
      </form>
    </>
  );
}
