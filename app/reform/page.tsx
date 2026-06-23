import type { Metadata } from "next";
import Link from "next/link";
import { reformCards } from "@/lib/data";
import { ReformCard } from "@/components/ReformCard";

export const metadata: Metadata = {
  title: "Reform Watch — why now, and what's changing",
  description:
    "Curated digests of the independent reform analysis driving Cuba's 2026 window — what's moving in policy, and which Atlas assets it unlocks. Digests with full attribution; we never republish article text.",
};

const CONVERGENCE = [
  { n: "~$6,300", label: "Cuba GDP/capita (PPP)", accent: "text-text" },
  { n: "~$28,747", label: "Dominican Republic GDP/capita (PPP)", accent: "text-invest" },
  { n: "31.8%", label: "Inflation", accent: "text-risk" },
  { n: "~$976M", label: "FDI inflows", accent: "text-text" },
  { n: "1,384", label: "Electricity (kWh/capita)", accent: "text-text" },
];

export default function ReformPage() {
  // Reverse-chronological; ties broken by edition (newest edition first).
  const cards = [...reformCards].sort(
    (a, b) => b.date.localeCompare(a.date) || (b.edition ?? 0) - (a.edition ?? 0)
  );
  return (
    <div className="container-x py-8">
      <div className="kicker mb-2">Why now · what&apos;s changing</div>
      <h1 className="text-3xl font-bold tracking-tight">Reform Watch</h1>

      {/* Evergreen thesis */}
      <div className="mt-4 card p-5">
        <p className="prose-cuba max-w-none">
          Cuba&apos;s crisis is <strong className="text-text">structural, not cyclical</strong> — decades of
          accumulated decline, now compounded by an energy and balance-of-payments collapse. A credible
          path exists: a staged transformation toward a social-market economy under rule of law, with the{" "}
          <strong className="text-text">private sector and the diaspora as the engines</strong> of recovery.
          Independent Cuban economists have mapped the sequence. <strong className="text-text">2026 is the
          window.</strong> The Atlas tracks the assets; Reform Watch tracks the policy that unlocks them.
        </p>
      </div>

      {/* Convergence data panel */}
      <div className="mt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CONVERGENCE.map((s) => (
            <div key={s.label} className="card p-4">
              <div className={`font-mono text-2xl font-bold ${s.accent}`}>{s.n}</div>
              <div className="mt-1 text-xs text-fog">{s.label}</div>
            </div>
          ))}
        </div>
        <p className="mt-2 max-w-prose2 text-sm font-medium text-[#047857]">
          If a reformed Cuba closes even half the gap with its neighbor, the economy multiplies.
        </p>
        <p className="mt-1 text-xs text-ghost">Source: Cuba Transformación, Edition 1 (2026).</p>
      </div>

      {/* Digest feed */}
      <div className="mt-8 flex items-end justify-between">
        <h2 className="text-xl font-semibold">Reform digests</h2>
        <span className="text-xs text-ghost">{cards.length} curated · click #tags to filter the map</span>
      </div>
      <div className="mt-3 grid gap-4 lg:grid-cols-2">
        {cards.map((c) => (
          <ReformCard key={c.id} card={c} />
        ))}
      </div>

      <p className="mt-8 text-xs text-ghost">
        Curated digests, not reproductions — our own synopsis, one key stat, and a map-impact tag per
        source, with full attribution and a link to the original. We never store or republish article
        text. New cards are proposed by the agentic loop and approved by a human before publishing. See{" "}
        <Link href="/data" className="link">Data &amp; methodology</Link>.
      </p>
    </div>
  );
}
