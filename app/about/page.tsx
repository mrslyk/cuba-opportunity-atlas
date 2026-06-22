import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "What this is, why it exists, and how it stays current — the independent, compliance-aware counter-version of a government investment portal.",
};

export default function AboutPage() {
  return (
    <div className="container-x py-8">
      <div className="kicker mb-2">About</div>
      <h1 className="text-3xl font-bold tracking-tight">The Bloomberg-meets-Google-Maps of Cuban opportunity</h1>
      <div className="prose-cuba mt-4">
        <p className="text-base font-medium text-[#047857]">
          We&apos;re building this because we believe Cuba opens — and when it does, the people who
          mapped the opportunity and backed its entrepreneurs early will have built something that
          matters. This is optimism with a spreadsheet attached.
        </p>
        <p>
          This is the single best place to <em>discover</em> where value will be unlocked across
          Cuba — and to <em>act</em> on the slice that is legal today. Three products fused on one
          map: a deal marketplace (small, legal), an infrastructure atlas (large, informational),
          and a confiscated-property claims registry (the legal landmine map).
        </p>

        <h2>Why it&apos;s different</h2>
        <p>
          The closest analogue is <a href="https://globalenergymonitor.org/" target="_blank" rel="noopener noreferrer">Global Energy Monitor</a> —
          asset-level maps with ownership traced to the ultimate state parent. The closest
          single-country thing is a government investment-promotion portal like Cuba&apos;s own
          ProCuba &quot;Cartera de Oportunidades.&quot; This site is the independent, compliance-aware,
          claims-aware <em>counter-version</em> of that: <strong className="text-text">Global Energy
          Monitor for all of Cuba, with an AngelList button on the legal ~5% and a Helms-Burton risk
          overlay on the rest.</strong> No site combines deal flow + controlling entities +
          confiscation risk on one map. That fusion is the point.
        </p>

        <h2>The two layers</h2>
        <p>
          <strong className="text-text">Layer 1 — Support now:</strong> licensed private-sector
          MIPYMEs, backed through OFAC-authorized remittances and payments via QvaPay wallets — not
          equity. <strong className="text-text">Layer 2 — Atlas:</strong>{" "}
          the full state economy, information only, &quot;register interest&quot; for a post-sanctions
          world or non-U.S. capital. Publishing information is protected; routing U.S. money into
          Layer 2 is the violation — so the product never does. See <Link href="/compliance" className="link">Compliance</Link>.
        </p>

        <h2>How it stays current</h2>
        <p>
          A scheduled agentic worker (Netlify Scheduled Function) refreshes asset status and sources
          and re-screens ownership against the live Cuba Restricted List and SDN. Nothing
          auto-publishes to Layer-1: a human approves every change in an admin review screen before
          any asset becomes &quot;supportable.&quot; The lists shown here are dated snapshots — see{" "}
          <Link href="/data" className="link">Data &amp; methodology</Link>.
        </p>

        <h2>Havana groundwork</h2>
        <p>
          Building relationships and pipeline on the ground — with private entrepreneurs, Cuba
          Emprende graduates, logistics — is good and legal. Any payment, gift or inducement to a
          Cuban government official, the Party, GAESA, or a Restricted-List entity is prohibited under
          both U.S. sanctions and the FCPA. Keep the skids greased with value and trust, not money to
          the regime.
        </p>
      </div>

      <p className="mt-8 text-xs text-ghost">
        This document is research and product design, not legal advice. Stand up the fund and any
        Cuba-facing transaction only with OFAC sanctions counsel and securities counsel.
      </p>
    </div>
  );
}
