const hues = [150, 200, 30, 280, 340, 90, 240, 10];

export default function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  const initials =
    name
      .split(/[\s\-_]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]!.toUpperCase())
      .join("") || "?";
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const hue = hues[h % hues.length];
  return (
    <span
      className="avatar"
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `hsl(${hue} 45% 88%)`,
        color: `hsl(${hue} 45% 28%)`,
      }}
    >
      {initials}
    </span>
  );
}
