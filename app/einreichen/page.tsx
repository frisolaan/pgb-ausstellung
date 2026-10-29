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
    const files = (form.getAll("images") as File[]).filter((f) => f && f.size > 0).slice(0, 10);

    const docs = (form.getAll("docs") as File[]).filter((f) => f && f.size > 0).slice(0, 10);
    if (files.some((f) => f.size > 10 * 1024 * 1024)) {
      setError("Ein Bild ist grösser als 10 MB. Bitte verkleinern.");
      return;
    }
    if (docs.some((f) => f.size > 25 * 1024 * 1024)) {
      setError("Ein Dokument ist grösser als 25 MB.");
      return;
    }

    setPhase("sending");
    try {
      // Zugangscode zuerst prüfen, damit bei falschem Code nichts hochgeladen wird
      setProgress("Zugangscode wird geprüft …");
      const check = await fetch("/api/check-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!check.ok) throw new Error("Zugangscode ist falsch.");

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

      const docInfos: { url: string; name: string; size: number }[] = [];
      for (const [i, doc] of docs.entries()) {
        setProgress(`Dokument ${i + 1} von ${docs.length} wird hochgeladen …`);
        const safe = doc.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
        const blob = await upload(`uploads/docs/${safe}`, doc, {
          access: "public",
          handleUploadUrl: "/api/upload",
          clientPayload: code,
          contentType: doc.type || undefined,
        });
        docInfos.push({ url: blob.url, name: doc.name, size: doc.size });
      }

      setProgress("Angaben werden gespeichert …");
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          title: form.get("title"),
          presenter: form.get("presenter"),
          group: form.get("group"),
          subject: form.get("subject"),
          summary: form.get("summary"),
          bne: form.get("bne"),
          link: form.get("link"),
          images: urls,
          files: docInfos,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Speichern fehlgeschlagen.");
      setPhase("done");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unbekannter Fehler.";
      setError(
        msg.includes("Zugangscode")
          ? "Der Zugangscode ist falsch. Bitte den Code aus der Mail an die Projektgruppe verwenden."
          : msg.includes("client token")
            ? "Der Upload wurde vom Server abgelehnt. Bitte Dateityp und Grösse prüfen und nochmals versuchen."
            : msg,
      );
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
          Euer Produkt ist eingegangen. Es erscheint in der Ausstellung, sobald sie freigegeben ist.
        </p>
        <p>
          <button className="btn secondary" onClick={() => setPhase("form")}>Weiteres Produkt einreichen</button>
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="hero" style={{ paddingBottom: 12 }}>
        <div className="eyebrow">Für die Projektgruppen</div>
        <h1>Produkt einreichen</h1>
        <div className="notice">
          <strong>So geht&apos;s</strong>
          <ol className="steps">
            <li>Zugangscode eingeben (steht in der Mail an die Projektgruppe).</li>
            <li>Einen Platzhalternamen wählen (kein Klarname). Unter diesem Namen erscheint eure Kachel. Für mehrere Produkte immer denselben Namen verwenden.</li>
            <li>Titel und Beschreibung des Produkts ausfüllen.</li>
            <li>Bis zu 10 Bilder (je max. 10 MB) für die Ausstellung hochladen.</li>
            <li>Optional bis zu 10 Dokumente (PDF, Word, PowerPoint, Excel, ZIP; je max. 25 MB) als Material für die Aufbereitung beilegen.</li>
            <li>Absenden. Nach der Freigabe erscheint das Produkt in der Ausstellung.</li>
          </ol>
        </div>
      </section>

      <form className="stack" onSubmit={onSubmit}>
        <label>
          Zugangscode
          <input type="password" name="code" required autoComplete="off" />
        </label>
        <label>
          Platzhaltername
          <small>Kein Klarname, z. B. «Team NMG» oder «Person C». Erscheint auf der Kachel.</small>
          <input type="text" name="presenter" required maxLength={60} placeholder="z. B. Team NMG" />
        </label>
        <label>
          Institution <small>optional</small>
          <input type="text" name="group" maxLength={120} placeholder="z. B. PH Graubünden" />
        </label>
        <label>
          Titel des Produkts
          <input type="text" name="title" required maxLength={120} placeholder="z. B. Smartplants" />
        </label>
        <label>
          Fach oder Bereich <small>optional</small>
          <input type="text" name="subject" maxLength={120} placeholder="z. B. NMG / Informatik" />
        </label>
        <label>
          Beschreibung
          <small>Worum geht es, wie wurde das Produkt im Unterricht eingesetzt?</small>
          <textarea name="summary" required maxLength={3000} />
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
          Bilder <small>bis zu 10 Bilder (JPG, PNG, WebP)</small>
          <input type="file" name="images" accept="image/jpeg,image/png,image/webp,image/gif" multiple />
        </label>
        <label>
          Dokumente
          <small>bis zu 10 Dateien: PDF, Word, PowerPoint, Excel, OpenOffice, ZIP. Die Dokumente werden nicht öffentlich angezeigt. Sie dienen der Projektleitung als Material, um euer Produkt in der Ausstellung aufzubereiten. Tipp: Dateien aus Teams zuerst herunterladen, dann hier auswählen.</small>
          <input
            type="file"
            name="docs"
            multiple
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.odt,.odp,.ods,.zip"
          />
        </label>
        <div className="notice">
          <strong>Wichtig:</strong> Bilder und Texte erscheinen nach der Freigabe öffentlich in der Ausstellung.
          Dokumente sind nicht öffentlich verlinkt, aber auch nicht passwortgeschützt gespeichert. Bitte keine
          vertraulichen Unterlagen und keine Daten von Schülerinnen und Schülern hochladen.
        </div>
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
            {phase === "sending" ? "Wird gesendet …" : "Produkt absenden"}
          </button>
        </div>
      </form>
    </>
  );
}
