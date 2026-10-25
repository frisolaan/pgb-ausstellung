import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Making × BNE – Ausstellung",
  description: "Online-Ausstellung der Unterrichtseinheiten aus dem Teilprojekt PgB 1b (Making und Bildung für Nachhaltige Entwicklung).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de-CH">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat+Brush&display=swap" rel="stylesheet" />
      </head>
      <body>
        <header className="site">
          <div className="wrap">
            <Link href="/" className="brand">
              Making <span>×</span> BNE
            </Link>
            <nav>
              <Link href="/">Ausstellung</Link>
              <Link href="/einreichen">Produkt einreichen</Link>
            </nav>
          </div>
        </header>
        <main className="wrap">{children}</main>
        <footer className="site">
          <div className="wrap">Teilprojekt PgB 1b · Making und Bildung für Nachhaltige Entwicklung</div>
        </footer>
      </body>
    </html>
  );
}
