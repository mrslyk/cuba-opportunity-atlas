import type { Metadata } from "next";
import Link from "next/link";
import { sdn } from "@/lib/data";
import { DisclosureBanner } from "@/components/DisclosureBanner";

export const metadata: Metadata = {
  title: "The law on the ground — what's allowed in Cuba",
  description:
    "A plain-English, primary-sourced deep dive on the two legal regimes that govern Cuban assets — Cuban domestic law and U.S. sanctions law — and exactly what a foreign/U.S. investor may and may not do today.",
};

function Src({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link">{children}</a>
  );
}

/* Allowed / Not-allowed row */
function Rule({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5 text-sm text-fog">
      <span className={ok ? "text-invest" : "text-state"}>{ok ? "✓" : "✕"}</span>
      <span>{children}</span>
    </li>
  );
}

export default function LegalPage() {
  return (
    <div>
      <DisclosureBanner />
      <div className="container-x py-8">
        <div className="kicker mb-2">The law on the ground</div>
        <h1 className="text-3xl font-bold tracking-tight">What&apos;s allowed in Cuba — and what isn&apos;t</h1>
        <p className="prose-cuba mt-3">
          Every asset on this atlas sits under <strong className="text-text">two legal regimes at
          once</strong>, and you must satisfy <em>both</em>: <strong className="text-text">Cuban
          domestic law</strong> decides what a foreigner may own or do inside Cuba, and{" "}
          <strong className="text-text">U.S. sanctions law</strong> decides what a U.S. person may
          touch at all. A deal that is legal in Havana can still be a felony in Miami. This page is
          the plain-English map of both — with primary sources where we have them, and an honest
          flag where the law is unsettled.
        </p>

        {/* The headline finding */}
        <div className="mt-6 card border-risk/40 bg-risk/5 p-5">
          <div className="kicker mb-1 text-risk">The finding that shapes everything</div>
          <p className="text-sm text-fog">
            There is <strong className="text-text">no equity lane.</strong> No U.S. OFAC general
            license authorizes a U.S. person to take an <em>ownership stake</em> in a Cuban private
            business — and the widely-repeated claim that Cuba began letting the diaspora take equity
            in MIPYMEs in March 2026 <strong className="text-text">could not be verified against
            primary Cuban law.</strong> Both sides point the same way: the only clearly-authorized
            way for a U.S. person to back a Cuban entrepreneur today is{" "}
            <strong className="text-text">remittance / payment support</strong> (via QvaPay),{" "}
            <strong className="text-text">not equity.</strong> That is why this site says
            &quot;support,&quot; never &quot;invest.&quot;
          </p>
        </div>

        <Link href="/legal/process" className="card card-hover mt-6 flex items-center justify-between gap-3 p-4">
          <div>
            <div className="kicker text-atlas">Go deeper</div>
            <div className="mt-1 font-semibold text-text">How to invest under Cuban law — every requirement →</div>
            <div className="mt-0.5 text-sm text-fog">The full Law 118 process: the 7 approval stages &amp; deadlines, the three vehicles, capital, tax &amp; labor regimes, guarantees, and the Mariel fast-track.</div>
          </div>
        </Link>

        {/* PART 1 — CUBA */}
        <h2 className="mt-10 text-2xl font-bold">1 · On the ground in Cuba (Cuban law)</h2>
        <p className="prose-cuba mt-2">
          Foreign investment is governed by <strong className="text-text">Law No. 118 of 2014</strong>{" "}
          and its regulation <strong className="text-text">Decreto 325/2018</strong> (
          <Src href="https://inviertaencuba.mincex.gob.cu/es/marco-legal/">MINCEX, marco legal</Src>).
          Cuban law lets foreigners invest — but almost always <em>with</em> the state, in approved
          projects, never by quietly buying a state asset or a private shop.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="card p-5">
            <div className="badge legal-invest mb-3">✓ Allowed under Cuban law</div>
            <ul className="space-y-2">
              <Rule ok>
                Foreign investment through <strong className="text-text">three forms</strong>: a joint
                venture (<em>empresa mixta</em>), an international economic association contract
                (<em>AEI</em>), or a wholly-foreign-owned enterprise. (
                <Src href="https://vuceregulaciones.mincex.gob.cu/media/Ley%20No_118_ESP.pdf">Ley 118</Src>)
              </Rule>
              <Rule ok>
                In <strong className="text-text">all sectors except</strong> health &amp; education for
                the population and the armed forces (bar their enterprise systems).
              </Rule>
              <Rule ok>
                <strong className="text-text">Repatriate profits freely</strong> abroad in convertible
                currency, with no transfer tax.
              </Rule>
              <Rule ok>
                Protection from expropriation except declared public-utility, with indemnification at
                commercial value in convertible currency.
              </Rule>
              <Rule ok>
                Up to <strong className="text-text">100% foreign ownership inside the Mariel Special
                Development Zone</strong> (ZED Mariel, Decreto-Ley 313).
              </Rule>
              <Rule ok>
                Operate licensed private <strong className="text-text">MIPYMEs</strong> (≤100
                employees) — now under <strong className="text-text">Decreto-Ley 88/2024</strong>.
              </Rule>
            </ul>
          </div>
          <div className="card p-5">
            <div className="badge badge-sdn mb-3">✕ Not allowed / unsettled</div>
            <ul className="space-y-2">
              <Rule ok={false}>
                <strong className="text-text">Buying a Cuban state asset outright.</strong> State-asset
                deals must be approved by the state (MINCEX → Council of Ministers, or delegated
                ministry heads per <Src href="https://inviertaencuba.mincex.gob.cu/es/marco-legal/">Acuerdo 8732/2019</Src>)
                and fit the <strong className="text-text">Cartera de Oportunidades</strong> portfolio.
              </Rule>
              <Rule ok={false}>
                Investing in <strong className="text-text">health/education-to-population</strong> or
                the armed forces&apos; sectors.
              </Rule>
              <Rule ok={false}>
                <strong className="text-text">Foreigner/diaspora taking direct equity in a private
                MIPYME — UNVERIFIED.</strong> Widely reported (≈March 2026) but not confirmable in
                primary law. A 2026 migration/investor reform exists (
                <Src href="https://www.granma.cu/cuba/2026-05-06/nuevas-leyes-de-inmigracion-extranjeria-y-ciudadania-transforman-sistema-migratorio-cubano-05-05-2026-18-05-12">Granma, May 2026</Src>);
                its equity scope is unclear. Treat as <strong className="text-text">counsel-required.</strong>
              </Rule>
              <Rule ok={false}>
                Routing money through the military conglomerate <strong className="text-text">GAESA</strong>{" "}
                and its arms (CIMEX, Gaviota, FINCIMEX, Almacenes Universales) — which control ports,
                tourism, retail and the remittance rails.
              </Rule>
            </ul>
          </div>
        </div>

        {/* PART 2 — U.S. */}
        <h2 className="mt-10 text-2xl font-bold">2 · The U.S. side (sanctions law)</h2>
        <p className="prose-cuba mt-2">
          The embargo baseline is the <strong className="text-text">Cuban Assets Control Regulations
          (31 CFR Part 515)</strong>: for a U.S. person, transactions with Cuba are prohibited unless
          authorized, and <strong className="text-text">§515.201(c)</strong> independently bans
          structuring around the rules. A narrow set of general licenses opens a private-sector lane.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="card p-5">
            <div className="badge legal-invest mb-3">✓ Authorized for U.S. persons</div>
            <ul className="space-y-2">
              <Rule ok>
                <strong className="text-text">Remittances &amp; payments</strong> to Cuban nationals and
                independent private entrepreneurs (§515.570).
              </Rule>
              <Rule ok>
                <strong className="text-text">Importing goods &amp; services</strong> from independent
                private sector entrepreneurs — §515.582, using the §515.340 ≤100-employee /
                non-regime test. (
                <Src href="https://www.federalregister.gov/documents/2024/05/29/2024-11618/cuban-assets-control-regulations">Fed. Reg. 2024-11618</Src>)
              </Rule>
              <Rule ok>
                <strong className="text-text">Internet-based services</strong> (§515.578) and
                telecom/payment platforms (§515.542).
              </Rule>
              <Rule ok>
                <strong className="text-text">U.S. bank accounts</strong> opened solely in the name of a
                Cuban independent private entrepreneur (§515.584(h), new in 2024).
              </Rule>
            </ul>
          </div>
          <div className="card p-5">
            <div className="badge badge-sdn mb-3">✕ Prohibited for U.S. persons</div>
            <ul className="space-y-2">
              <Rule ok={false}>
                <strong className="text-text">Equity in any Cuban enterprise.</strong> No general
                license authorizes it — it would need a specific OFAC license.
              </Rule>
              <Rule ok={false}>
                Any transaction with <strong className="text-text">GAESA / Restricted-List / SDN</strong>{" "}
                entities. GAESA has been SDN + Restricted-List since Dec 2020 and was re-designated
                under <strong className="text-text">EO 14404 (May 7 2026)</strong>. (
                <Src href="https://ofac.treasury.gov/faqs/added/2026-05-07">OFAC FAQ</Src>)
              </Rule>
              <Rule ok={false}>
                Lodging at a <strong className="text-text">Prohibited Accommodations List</strong> hotel;
                any <strong className="text-text">confiscated-property</strong> nexus →{" "}
                <Link href="/claims" className="link">Helms-Burton Title III</Link> treble-damages
                liability, broadened by <em>Havana Docks</em> (May 21 2026); Title IV visa bars.
              </Rule>
              <Rule ok={false}>
                <strong className="text-text">Payments or inducements to Cuban officials</strong> — FCPA
                plus sanctions exposure.
              </Rule>
            </ul>
          </div>
        </div>

        {/* General licenses (dynamic) */}
        <h2 className="mt-10 text-xl font-semibold">The general licenses that open the lane</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {sdn.general_licenses_enabling_private_sector.map((gl) => (
            <div key={gl.cite} className="card p-3">
              <div className="font-mono text-xs text-invest">{gl.cite}</div>
              <div className="mt-1 text-sm text-text">{gl.authorizes}</div>
              {gl.relevance && <div className="mt-1 text-xs text-ghost">{gl.relevance}</div>}
            </div>
          ))}
        </div>

        {/* Timeline */}
        <h2 className="mt-10 text-xl font-semibold">What changed in 2025–2026</h2>
        <ul className="mt-3 space-y-2">
          {[...sdn.key_dates].sort((a, b) => a.date.localeCompare(b.date)).map((d) => (
            <li key={d.date + d.event} className="flex gap-3 text-sm">
              <span className="w-24 shrink-0 font-mono text-xs text-ghost">{d.date}</span>
              <span className="text-fog">{d.event}</span>
            </li>
          ))}
        </ul>

        {/* PART 3 — the lane */}
        <h2 className="mt-10 text-2xl font-bold">3 · The only lane today</h2>
        <p className="prose-cuba mt-2">
          Put the two regimes together and one path survives: <strong className="text-text">support
          the licensed independent private sector through OFAC-authorized remittances and payments,
          routed via QvaPay</strong>, to entrepreneurs who pass a KYC + OFAC-SDN screen as
          independent private entities of ≤100 employees — with settlement that never touches GAESA,
          FINCIMEX, or a Cuban state bank, and no confiscated-property nexus. Not equity, not state
          assets, no regime counterparties. See <Link href="/invest" className="link">how support
          works</Link> and the <Link href="/compliance" className="link">compliance posture</Link>.
        </p>

        <div className="mt-4 card p-5">
          <div className="kicker mb-2">Open legal questions (get counsel)</div>
          <ul className="space-y-1.5 text-sm text-fog">
            <li>• Whether Cuban law actually permits foreign/diaspora <em>equity</em> in MIPYMEs (unverified).</li>
            <li>• How EO 14404&apos;s IEEPA program and secondary-sanctions reach interact with the CACR private-sector GLs.</li>
            <li>• Helms-Burton Title III exposure for any asset with a confiscation history after <em>Havana Docks</em>.</li>
            <li>• Securities-law treatment of any pooled vehicle, even one limited to remittance/payment support.</li>
          </ul>
        </div>

        <p className="mt-8 text-xs text-ghost">
          Confidence: Cuban-law and core OFAC statements above are drawn from primary sources
          (MINCEX/Ley 118, Gaceta Oficial, Federal Register 2024-11618, OFAC FAQs) and were
          adversarially verified; Helms-Burton and EO 14404 secondary-effects statements rest on
          named law-firm analyses and the ingested OFAC corpus and are not individually
          court-confirmed here. See <Link href="/data" className="link">Data &amp; methodology</Link>.
          <strong className="text-text"> This is research, not legal advice</strong> — stand up any
          structure only with OFAC sanctions counsel and securities counsel.
        </p>
      </div>
    </div>
  );
}
