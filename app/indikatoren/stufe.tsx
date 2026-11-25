import { STUFEN, type Stufe } from "@/lib/indikatoren";

const KURZ: Record<Stufe, string> = { deutlich: "ausdrücklich", teilweise: "teilweise", offen: "nicht ausgewiesen" };

export default function StufeBadge({ stufe }: { stufe: Stufe }) {
  return (
    <span className={`stufe ${stufe}`} title={STUFEN[stufe]}>
      <i className={`punkt ${stufe}`} aria-hidden="true" />
      {KURZ[stufe]}
    </span>
  );
}
