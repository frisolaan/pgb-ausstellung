"""Ersetzt in den statischen Produktseiten den Abschnitt «Indikatoren» aus lib/indikatoren.json.

Aufruf: python3 scripts/indikatoren-in-produktseiten.py
"""
import html, json, re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
data = json.loads((ROOT / "lib/indikatoren.json").read_text())
SEITEN = {"smart-plants": "smart-plants", "pumpspeicher": "pumpspeicherkraftwerk"}
KURZ = {"deutlich": "ausdrücklich", "teilweise": "teilweise", "offen": "nicht ausgewiesen"}
e = html.escape

CSS = """<style id="indik-css">
.indik { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
.indik li > a { display: grid; grid-template-columns: 2.2em 1fr auto; gap: 4px 12px; align-items: baseline; text-decoration: none; color: var(--ink); background: var(--surface); border: 1px solid var(--line); border-left: 5px solid #9a988f; border-radius: var(--r, 12px); padding: 12px 14px; }
.indik li > a:hover { box-shadow: 0 6px 18px rgba(0,0,0,0.08); }
.indik .deutlich > a { border-left-color: #2f6b4f; }
.indik .teilweise > a { border-left-color: #c58a1c; }
.indik .nr { font-weight: 700; color: var(--ink-mute, #777); }
.indik .t { font-weight: 700; }
.indik .s { font-size: .78rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-mute, #777); }
.indik .w { grid-column: 2 / -1; font-size: .9rem; color: var(--ink-soft, #555); }
.indik-mehr { margin-top: 14px; }
@media (max-width: 560px) { .indik li > a { grid-template-columns: 2.2em 1fr; } .indik .s { grid-column: 2; } }
</style>"""

SCRIPT = """<script id="hash-oeffnen">
(function () {
  function oeffnen() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    var el = document.getElementById(id);
    if (el && el.tagName === "DETAILS") { el.open = true; el.scrollIntoView(); }
  }
  window.addEventListener("hashchange", oeffnen);
  oeffnen();
})();
</script>"""


def abschnitt(key):
    items = []
    for i, ind in enumerate(data["indikatoren"], 1):
        f = ind["fundstellen"][key]
        if f["stellen"]:
            was = "; ".join(f"{s['wo']}: {s['was'].rstrip('.')}" for s in f["stellen"])
            was += "" if was.endswith(("?", "!", "»")) else "."
        else:
            was = f.get("hinweis", "")
        items.append(
            f'      <li class="{f["stufe"]}"><a href="/indikatoren/{ind["slug"]}">'
            f'<span class="nr">{i}</span><span class="t">{e(ind["titel"])}</span>'
            f'<span class="s">{KURZ[f["stufe"]]}</span><span class="w">{e(was)}</span></a></li>'
        )
    return f"""<section class="teil" id="indikatoren" aria-labelledby="h-indikatoren">
  <div class="wrap">
    <h2 id="h-indikatoren" class="hand">Indikatoren Making × BNE</h2>
    <p class="teil-intro">Entwurf zur Diskussion: Wo die sieben Indikatoren der Projektgruppe in dieser Lerneinheit vorkommen. Die Zuordnung stammt nicht aus dem Dossier und ist von der Projektgruppe noch zu bestätigen.</p>
    <ul class="indik">
{chr(10).join(items)}
    </ul>
    <p class="indik-mehr"><a href="/indikatoren">Alle Indikatoren im Vergleich der Produkte →</a></p>
  </div>
</section>"""


for key, ordner in SEITEN.items():
    p = ROOT / "public/produkte" / ordner / "index.html"
    s = p.read_text()
    neu = abschnitt(key)
    muster = re.compile(r'<section class="teil" id="(kartenset|indikatoren)".*?</section>', re.S)
    assert muster.search(s), p
    s = muster.sub(lambda m: neu, s, count=1)
    s = s.replace('<a href="#kartenset">Kartenset</a>', '<a href="#indikatoren">Indikatoren</a>')
    s = re.sub(r'<style id="indik-css">.*?</style>\n?', "", s, flags=re.S)
    s = s.replace("</head>", CSS + "\n</head>", 1)
    s = re.sub(r'<script id="hash-oeffnen">.*?</script>\n?', "", s, flags=re.S)
    s = s.replace("</body>", SCRIPT + "\n</body>", 1)
    p.write_text(s)
    print("aktualisiert:", p.relative_to(ROOT))
