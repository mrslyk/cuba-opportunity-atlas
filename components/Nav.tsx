"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/map", label: "Map" },
  { href: "/sectors", label: "Sectors" },
  { href: "/claims", label: "Claims" },
  { href: "/entities", label: "Entities" },
  { href: "/invest", label: "Support" },
  { href: "/legal", label: "Legal" },
  { href: "/compliance", label: "Compliance" },
  { href: "/data", label: "Data" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--bg)]/90 backdrop-blur">
      <div className="container-x flex h-14 items-center gap-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-6 w-6 place-items-center rounded bg-private/15 font-mono text-[13px] text-private">◆</span>
          <span>Cuba</span>
          <span className="kicker hidden sm:inline">Opportunity Atlas</span>
        </Link>
        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active = path === l.href || (l.href !== "/" && path.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                  active ? "bg-black/[0.05] font-medium text-text" : "text-fog hover:bg-black/[0.04] hover:text-text"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/invest" className="btn btn-primary ml-auto md:ml-0 px-3 py-1.5 text-xs">
          Support entrepreneurs
        </Link>
      </div>

      {/* Mobile: horizontally scrollable link row */}
      <nav className="flex gap-1 overflow-x-auto border-t border-[var(--line)] px-3 py-2 md:hidden">
        {LINKS.map((l) => {
          const active = path === l.href || (l.href !== "/" && path.startsWith(l.href));
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap rounded-md px-2.5 py-1 text-sm ${
                active ? "bg-black/[0.05] font-medium text-text" : "text-fog"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
