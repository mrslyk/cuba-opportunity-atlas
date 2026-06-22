import type { Metadata } from "next";
import Link from "next/link";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://cubanew.com"),
  title: {
    default: "Cuba Opportunity Atlas",
    template: "%s · Cuba Opportunity Atlas",
  },
  description:
    "The map-first intelligence atlas of Cuba's economy: every major asset, who controls it, what needs to be built, who it was confiscated from — and the licensed private-sector slice that is legally investable today.",
  openGraph: {
    title: "Cuba Opportunity Atlas",
    description:
      "Every major asset in Cuba's economy: ownership, buildout gap, Helms-Burton claims, and the legal private-sector lane.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <Nav />
        <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--line)] bg-[var(--panel)]">
      <div className="container-x grid gap-8 py-10 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-semibold text-text">Cuba Opportunity Atlas</div>
          <p className="mt-2 text-xs text-ghost">
            Independent research. The Bloomberg-meets-Google-Maps of Cuban opportunity, with a
            compliance line drawn on every asset.
          </p>
        </div>
        <FooterCol title="Explore" links={[["/map", "Interactive map"], ["/sectors", "Sectors"], ["/claims", "Helms-Burton claims"], ["/entities", "Controlling entities"]]} />
        <FooterCol title="Act" links={[["/invest", "Back entrepreneurs"], ["/compliance", "Compliance posture"], ["/data", "Data & methodology"], ["/about", "About"]]} />
        <div className="text-xs text-ghost">
          <div className="kicker mb-2">Legal</div>
          <p>
            Research and product design, not legal advice. U.S. sanctions restrict Cuba investment
            to the licensed private sector. Stand up any Cuba-facing transaction only with OFAC
            sanctions counsel and securities counsel.
          </p>
        </div>
      </div>
      <div className="border-t border-[var(--line)]">
        <div className="container-x flex flex-wrap items-center justify-between gap-2 py-4 text-xs text-ghost">
          <span>
            © 2026 Cuba Opportunity Atlas · powered by{" "}
            <a href="https://qvapay.com" target="_blank" rel="noopener noreferrer" className="text-text hover:text-private hover:underline">QvaPay</a>{" "}
            — fintech OS for a free and prosperous Cuba.
          </span>
          <span className="font-mono">Data as of 2026-06-20</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="kicker mb-2">{title}</div>
      <ul className="space-y-1.5">
        {links.map(([href, label]) => (
          <li key={href}>
            <Link href={href} className="text-fog hover:text-text">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
