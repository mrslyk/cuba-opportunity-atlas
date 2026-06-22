import type { Metadata } from "next";
import Link from "next/link";
import { supportable, sdn } from "@/lib/data";
import { DisclosureBanner } from "@/components/DisclosureBanner";
import { OpportunityCard } from "@/components/OpportunityCard";

export const metadata: Metadata = {
  title: "Support — back Cuba's entrepreneurs",
  description: "The compliant support flow: OFAC-authorized remittances and payments to licensed private-sector MIPYMEs, routed via QvaPay wallets. No equity, no state counterparty.",
};

export default function InvestPage() {
  const gls = sdn.general_licenses_enabling_private_sector;
  return (
    <div>
      <DisclosureBanner />
      <div className="container-x py-8">
        <div className="kicker mb-2 text-invest">Layer 1 · Compliant today</div>
        <h1 className="text-3xl font-bold tracking-tight">Support Cuba&apos;s entrepreneurs now</h1>
        <p className="prose-cuba mt-3">
          The legal lane for U.S. persons today is <strong className="text-text">support, not
          equity</strong>: OFAC-authorized remittances and payments to the licensed independent
          private sector — Cuban-owned MIPYMEs of ≤100 employees, not regime- or Party-linked —
          routed through QvaPay wallets. We deliberately do <strong className="text-text">not</strong>{" "}
          take equity stakes in Cuban entities; that keeps participation squarely inside the general
          licenses below.
        </p>
        <p className="mt-4 max-w-prose2 text-base font-medium text-[#047857]">
          This is the hopeful part: every dollar goes straight to a Cuban entrepreneur building
          something real — a paladar, a farm, a workshop — and lands on the ground the same day. You
          don&apos;t have to wait for the island to open to start backing its people.
        </p>

        {/* How it works */}
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <Step n={1} title="Authorized support">
            Remittances &amp; payments under OFAC general licenses (§515.570 / §515.578 / §515.542) —
            not securities, not equity. No card or bank credentials touch this site.
          </Step>
          <Step n={2} title="Screening">
            Every recipient is KYC&apos;d, OFAC-SDN &amp; Cuba Restricted List screened, and confirmed
            an independent private entity (≤100 employees), reviewed by OFAC counsel.
          </Step>
          <Step n={3} title="QvaPay wallets">
            Funds land on the ground via QvaPay wallets (QUSD) — never through Cuban state banks,
            FINCIMEX, GAESA or any Restricted-List counterparty.
          </Step>
        </div>

        {/* CTA */}
        <div className="mt-6 card border-invest/40 bg-invest/5 p-5">
          <h2 className="text-lg font-semibold text-text">Support via QvaPay</h2>
          <p className="mt-2 text-sm text-fog">
            Participation is OFAC-authorized remittance/payment support to vetted private
            entrepreneurs, with OFAC counsel sign-off — not an equity offering.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href="https://qvapay.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Support via QvaPay →</a>
            <Link href="/compliance" className="btn btn-ghost">Read the compliance posture →</Link>
          </div>
        </div>

        {/* Supportable assets */}
        <h2 className="mt-10 text-xl font-semibold">Supportable now</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {supportable.map((o) => (
            <OpportunityCard key={o.id} o={o} />
          ))}
        </div>

        {/* Legal authorities */}
        <h2 className="mt-10 text-xl font-semibold">The legal basis</h2>
        <p className="mt-1 text-sm text-fog">General licenses that authorize this private-sector support lane:</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {gls.map((gl) => (
            <div key={gl.cite} className="card p-3">
              <div className="font-mono text-xs text-invest">{gl.cite}</div>
              <div className="mt-1 text-sm text-text">{gl.authorizes}</div>
              {gl.relevance && <div className="mt-1 text-xs text-ghost">{gl.relevance}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-invest/15 font-mono text-xs text-invest">{n}</span>
        <h3 className="font-semibold text-text">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-fog">{children}</p>
    </div>
  );
}
