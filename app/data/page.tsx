import type { Metadata } from "next";
import Link from "next/link";
import { enriched, crl, sdn, cpal, entities, macro } from "@/lib/data";

export const metadata: Metadata = {
  title: "Data & methodology",
  description: "Sources, retrieval dates, and methodology behind the Opportunity Atlas and its compliance corpus.",
};

export default function DataPage() {
  const sources = [
    { name: "Opportunities dataset", count: `${enriched.length} assets`, retrieved: "2026-06-20", src: "Research appendix (Seatrade, BNamericas, Reuters, USGS, GEM, UNESCO, FCSC, SCOTUS, et al.)" },
    { name: "Cuba Restricted List", count: `${crl.categories.reduce((n, c) => n + c.entities.length, 0)} entities`, retrieved: crl.retrieved, src: "U.S. State Dept · Federal Register 2025-13149" },
    { name: "OFAC SDN + authorities", count: `${sdn.sdn_entries.length} designations`, retrieved: sdn.retrieved, src: "OFAC · EO 14404 (2026)" },
    { name: "Prohibited Accommodations List", count: `${cpal.properties.length} hotels`, retrieved: cpal.retrieved, src: "U.S. State Dept · Federal Register 2025-13148" },
    { name: "Controlling-entity registry", count: `${entities.length} entities`, retrieved: "2026-06-20", src: "Curated; sanctions flags auto cross-referenced" },
    { name: "Macro context", count: "Country profile", retrieved: (macro as any).retrieved ?? "2026-06-20", src: "CIA World Factbook · World Bank cross-check" },
  ];

  return (
    <div className="container-x py-8">
      <div className="kicker mb-2">Methodology</div>
      <h1 className="text-3xl font-bold tracking-tight">Data &amp; sources</h1>
      <p className="prose-cuba mt-3">
        Every asset carries its own sources. The compliance corpus below is ingested from official
        U.S. government publications, validated against a typed schema at build time, and stamped
        with a retrieval date. <strong className="text-text">These are dated snapshots</strong> — the
        Restricted List and SDN change (both expanded under EO 14404). Operational screening must
        use the live OFAC/State sources; an agentic worker re-pulls them (see <Link href="/about" className="link">About</Link>).
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-[var(--line)]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-[var(--panel-2)] text-xs text-fog">
            <tr><th className="p-3">Dataset</th><th className="p-3">Size</th><th className="p-3">Retrieved</th><th className="p-3">Source of record</th></tr>
          </thead>
          <tbody>
            {sources.map((s) => (
              <tr key={s.name} className="border-t border-[var(--line)]">
                <td className="p-3 font-medium text-text">{s.name}</td>
                <td className="p-3 font-mono text-fog">{s.count}</td>
                <td className="p-3 font-mono text-ghost">{s.retrieved}</td>
                <td className="p-3 text-fog">{s.src}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 text-xl font-semibold">How the legal badge is computed</h2>
      <ol className="prose-cuba mt-2 list-decimal pl-5">
        <li>Each asset declares <code className="font-mono text-xs">ownership</code>, <code className="font-mono text-xs">layer</code> and <code className="font-mono text-xs">investable_us</code>.</li>
        <li>Its controlling entity&apos;s name/aka are matched against the Restricted List, SDN and CPAL.</li>
        <li><code className="font-mono text-xs">canInvest()</code> returns true only if the asset is private/Layer-1/investable AND no list matched.</li>
        <li>A build-time invariant throws if any &quot;investable&quot; asset has a sanctioned counterparty — so a data error cannot ship an illegal Invest button.</li>
      </ol>

      <p className="mt-6 text-xs text-ghost">
        Methodology and limitations are documented per-file (see the <code className="font-mono">notes</code> field
        in each dataset). Not legal advice.
      </p>
    </div>
  );
}
