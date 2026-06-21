import Link from "next/link";
import { MapView } from "@/components/MapView";
import { OpportunityCard } from "@/components/OpportunityCard";
import {
  mapPoints,
  investable,
  enriched,
  confiscated,
  titleIIIRiskAssets,
  entities,
} from "@/lib/data";

export default function Home() {
  const sanctionedEntities = entities.filter((e) => e.flags.crl || e.flags.sdn || e.flags.cpal).length;
  const stats = [
    { n: enriched.length, label: "Assets mapped" },
    { n: investable.length, label: "Investable today", accent: "text-invest" },
    { n: confiscated.length, label: "Confiscated claims" },
    { n: titleIIIRiskAssets.length, label: "Title III risk", accent: "text-risk" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="container-x pt-12 pb-8">
        <div className="kicker mb-3">Powered by QvaPay · independent research</div>
        <h1 className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
          Invest in a free Cuba&apos;s economy — and back its entrepreneurs{" "}
          <span className="text-private">today</span>.
        </h1>
        <p className="prose-cuba mt-5 text-base">
          The map-first intelligence atlas of every major asset in Cuba: who controls it, what it
          would take to rebuild it, who it was confiscated from in 1960 — and the licensed
          private-sector slice that&apos;s legally investable right now. Two layers, one compliance
          line drawn on every pixel.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/map" className="btn btn-atlas">Open the map →</Link>
          <Link href="/invest" className="btn btn-primary">Back entrepreneurs now</Link>
          <Link href="/claims" className="btn btn-ghost">Helms-Burton claims</Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card p-4">
              <div className={`font-mono text-3xl font-bold ${s.accent ?? "text-text"}`}>{s.n}</div>
              <div className="mt-1 text-xs text-fog">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Two-layer explainer */}
      <section className="container-x grid gap-4 py-6 md:grid-cols-2">
        <div className="card p-5" style={{ borderLeft: "3px solid #22c55e" }}>
          <div className="badge legal-invest mb-2">Layer 1 · Invest now</div>
          <h2 className="text-lg font-semibold text-text">Licensed private-sector deal flow</h2>
          <p className="mt-2 text-sm text-fog">
            Cuban-owned MIPYMEs (≤100 employees), legal under OFAC general licenses since the
            March 18 2026 rule change. Capital deploys through an AngelList SPV and lands on the
            ground via QvaPay wallets. Every recipient KYC&apos;d &amp; OFAC-screened.
          </p>
        </div>
        <div className="card p-5" style={{ borderLeft: "3px solid #38bdf8" }}>
          <div className="badge legal-atlas mb-2">Layer 2 · Opportunity Atlas</div>
          <h2 className="text-lg font-semibold text-text">The prize when it opens</h2>
          <p className="mt-2 text-sm text-fog">
            Ports, energy, water, rail, mining, industry — the full map of Cuba&apos;s state economy.
            <strong className="text-text"> Information only. No U.S. investment.</strong> Register
            interest for a post-sanctions world or non-U.S. capital.
          </p>
        </div>
      </section>

      {/* Map */}
      <section className="container-x py-6">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-xl font-semibold">The live atlas</h2>
          <Link href="/map" className="link text-sm">Full-screen map →</Link>
        </div>
        <MapView points={mapPoints} compact />
      </section>

      {/* Investable now */}
      <section className="container-x py-8">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <div className="badge legal-invest mb-2">✅ Legal today</div>
            <h2 className="text-xl font-semibold">Investable now — the private-sector lane</h2>
          </div>
          <Link href="/invest" className="link text-sm">How it works →</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {investable.map((o) => (
            <OpportunityCard key={o.id} o={o} />
          ))}
        </div>
      </section>
    </div>
  );
}
