import type { Metadata } from "next";
import Link from "next/link";
import { enriched, macro } from "@/lib/data";
import { SECTORS, sectorMeta } from "@/lib/sectors";

export const metadata: Metadata = {
  title: "Sectors",
  description: "Cuba's economy by sector — ports, energy, water, rail, mining, agriculture, biotech, tourism, manufacturing and the private sector — with the buildout gap.",
};

export default function SectorsPage() {
  const order = Object.keys(SECTORS);
  const grouped = order
    .map((key) => ({ key, items: enriched.filter((o) => o.sector === key) }))
    .filter((g) => g.items.length > 0);

  const g = (k: string) => (macro as any)[k];
  const gdp = g("gdp") || {};
  const comp = g("gdp_composition_by_sector") || {};

  return (
    <div className="container-x py-8">
      <div className="kicker mb-2">The full economy</div>
      <h1 className="text-3xl font-bold tracking-tight">Sectors &amp; the buildout gap</h1>
      <p className="prose-cuba mt-3">
        What exists, what&apos;s broken, and what needs to be built — across every sector of Cuba&apos;s
        economy. The private-sector lane is the only one investable today; the rest is the atlas of
        the prize when it opens.
      </p>

      {/* Macro strip (CIA World Factbook) */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Macro n={g("population")?.value} label="Population" />
        <Macro n={gdp.ppp || gdp.official} label={`GDP (${gdp.year ?? ""})`} />
        <Macro n={comp.services} label="Services share" />
        <Macro n={comp.industry} label="Industry share" />
      </div>
      <p className="mt-2 text-[11px] text-ghost">Macro: CIA World Factbook (see <Link href="/data" className="link">Data &amp; methodology</Link>).</p>

      <div className="mt-8 space-y-8">
        {grouped.map(({ key, items }) => {
          const m = sectorMeta(key);
          const buildout = items.filter((o) => /distress|idle|abandon|deteriorat|degrad|crisis|never|unfinished|stall|collaps|rebuild|moderniz|revival/i.test(`${o.status} ${o.type}`));
          const investable = items.filter((o) => o.investable);
          return (
            <section key={key}>
              <div className="flex items-center gap-2 border-b border-[var(--line)] pb-2">
                <span className="h-3 w-3 rounded-full" style={{ background: m.color }} />
                <h2 className="text-lg font-semibold text-text">{m.label}</h2>
                <span className="text-xs text-ghost">{items.length} assets</span>
                {investable.length > 0 && <span className="badge legal-invest">{investable.length} investable</span>}
                {buildout.length > 0 && <span className="badge badge-muted">{buildout.length} need buildout</span>}
              </div>
              <p className="mt-2 text-sm text-fog">{m.blurb}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((o) => (
                  <Link key={o.id} href={`/opportunity/${o.id}`} className="card card-hover flex items-center justify-between gap-2 p-3">
                    <span className="text-sm text-text">{o.name}</span>
                    <span className={`badge owner-${o.ownership} shrink-0`}>
                      {o.ownership === "private" ? "🟢" : o.ownership === "jv" ? "🟡" : "🔴"}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Macro({ n, label }: { n?: string; label: string }) {
  return (
    <div className="card p-4">
      <div className="font-mono text-lg font-bold text-text">{n || "—"}</div>
      <div className="mt-1 text-xs text-fog">{label}</div>
    </div>
  );
}
