import type { Metadata } from "next";
import Link from "next/link";
import { sdn, crl, cpal, investable } from "@/lib/data";
import { DisclosureBanner } from "@/components/DisclosureBanner";

export const metadata: Metadata = {
  title: "Compliance posture",
  description: "The legal posture as a feature: CACR, the Cuba Restricted List, Helms-Burton Title III/IV, OFAC general licenses, and the guardrails enforced in code.",
};

const GUARDRAILS = [
  "No Invest CTA anywhere on Layer-2 / state / JV / Restricted-List / SDN / confiscated assets.",
  "OFAC SDN + Cuba Restricted List + CPAL screening on every counterparty (auto cross-referenced here).",
  "Recipient = independent private entity ≤100 employees, non-regime, documented.",
  "Settlement path proven to avoid GAESA / state banks / FINCIMEX.",
  "No confiscated-property (Helms-Burton) nexus on any funded deal.",
  "Fund mandate limited to the private sector; securities + OFAC counsel sign-off.",
  "Disclosures on /invest and every opportunity page.",
  "Zero payments or inducements to officials or regime entities (FCPA + sanctions).",
];

export default function CompliancePage() {
  return (
    <div>
      <DisclosureBanner />
      <div className="container-x py-8">
        <div className="kicker mb-2">The legal posture — a feature, not fine print</div>
        <h1 className="text-3xl font-bold tracking-tight">Compliance</h1>
        <p className="prose-cuba mt-3">
          A U.S. person cannot wire money into Cuban state infrastructure — ports, energy, water,
          rail, refineries, large hotels, state industry. That is not a gray area. What is legal is
          financing the licensed independent private sector. This site is built so the line is
          enforced in code: an Invest button can only appear on the{" "}
          <Link href="/invest" className="link">{investable.length} private-sector entries</Link>{" "}
          that clear every screen.
        </p>

        {/* Engine note */}
        <div className="mt-6 card p-5">
          <h2 className="text-lg font-semibold text-text">Enforced in code</h2>
          <p className="mt-2 text-sm text-fog">
            A single compliance engine decides every CTA: <code className="rounded bg-[var(--panel-2)] px-1.5 py-0.5 font-mono text-xs text-invest">canInvest()</code> returns
            true only when an asset is <span className="text-text">private + Layer-1 + investable_us</span> AND
            its controlling counterparty clears the Cuba Restricted List ({crl.categories.reduce((n, c) => n + c.entities.length, 0)} entities),
            the OFAC SDN list, and the Prohibited Accommodations List ({cpal.properties.length} hotels).
            The data set fails to build if any record contradicts this.
          </p>
        </div>

        {/* Authorities */}
        <h2 className="mt-8 text-xl font-semibold">Legal authorities</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {sdn.authorities.map((a) => (
            <div key={a.cite} className="card p-3">
              <div className="font-mono text-xs text-atlas">{a.cite}</div>
              <div className="mt-1 text-sm text-fog">{a.what}</div>
            </div>
          ))}
        </div>

        {/* Helms-Burton */}
        <h2 className="mt-8 text-xl font-semibold">Helms-Burton</h2>
        <div className="prose-cuba mt-2">
          <p>
            <strong className="text-text">Title III</strong> — treble-damages lawsuits for
            &quot;trafficking&quot; in confiscated property, broadened by the Supreme Court&apos;s{" "}
            <Link href="/claims" className="link">Havana Docks ruling (May 21, 2026)</Link>.{" "}
            <strong className="text-text">Title IV</strong> — personal U.S. visa bars for officers
            and principals of trafficking entities. Both are reasons U.S. capital must stay out of
            confiscated infrastructure.
          </p>
        </div>

        {/* Timeline */}
        <h2 className="mt-8 text-xl font-semibold">Key dates</h2>
        <ul className="mt-3 space-y-2">
          {[...sdn.key_dates].sort((a, b) => a.date.localeCompare(b.date)).map((d) => (
            <li key={d.date + d.event} className="flex gap-3 text-sm">
              <span className="w-24 shrink-0 font-mono text-xs text-ghost">{d.date}</span>
              <span className="text-fog">{d.event}</span>
            </li>
          ))}
        </ul>

        {/* Guardrails */}
        <h2 className="mt-8 text-xl font-semibold">Ship-blocker guardrails</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {GUARDRAILS.map((g) => (
            <li key={g} className="card flex gap-2 p-3 text-sm text-fog">
              <span className="text-invest">✓</span> {g}
            </li>
          ))}
        </ul>

        <p className="mt-8 text-xs text-ghost">
          Research and product design, not legal advice. Stand up the fund and any Cuba-facing
          transaction only with OFAC sanctions counsel and securities counsel. Screening must use the
          live OFAC/State sources — the lists baked into this site are dated snapshots (see{" "}
          <Link href="/data" className="link">Data</Link>).
        </p>
      </div>
    </div>
  );
}
