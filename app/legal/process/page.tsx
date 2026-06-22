import type { Metadata } from "next";
import Link from "next/link";
import { DisclosureBanner } from "@/components/DisclosureBanner";

export const metadata: Metadata = {
  title: "How to invest under Cuban law — every requirement",
  description:
    "The full Law 118 process to invest in Cuba: the seven approval stages and statutory deadlines, the three investment vehicles, capital, tax and labor regimes, land rights, guarantees, dispute resolution, and the Mariel ZED fast-track.",
};

function Src({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="link">{children}</a>;
}

function Step({ n, title, deadline, children }: { n: string; title: string; deadline?: string; children: React.ReactNode }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-invest/15 font-mono text-xs text-invest">{n}</span>
        <h3 className="font-semibold text-text">{title}</h3>
        {deadline && <span className="badge badge-muted ml-auto">{deadline}</span>}
      </div>
      <p className="mt-2 text-sm text-fog">{children}</p>
    </div>
  );
}

export default function ProcessPage() {
  return (
    <div>
      <DisclosureBanner />
      <div className="container-x py-8">
        <div className="kicker mb-2">Cuban law · the full requirements</div>
        <h1 className="text-3xl font-bold tracking-tight">How to invest under Cuban law</h1>
        <p className="prose-cuba mt-3">
          This is the complete Law 118 process — every stage, deadline, document, and obligation
          required to stand up a foreign investment in Cuba. It governs the{" "}
          <strong className="text-text">state-economy and joint-venture lane</strong>: the path for
          non-U.S. capital and for a post-sanctions future.
        </p>
        <div className="mt-4 card border-risk/40 bg-risk/5 p-4 text-sm text-fog">
          <strong className="text-text">Read this with <Link href="/legal" className="link">What&apos;s allowed</Link> open.</strong>{" "}
          A U.S. person <em>cannot</em> use these equity vehicles today — there is no OFAC license for
          U.S. equity in Cuba, and most of this routes through state bodies. For U.S. persons the only
          lane is <Link href="/invest" className="link">support via QvaPay</Link>. The process below is
          the Cuban-side machinery — understand it, but don&apos;t act on it without OFAC + securities counsel.
        </div>

        {/* The legal stack */}
        <h2 className="mt-10 text-xl font-semibold">The governing rules</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div className="card p-3"><div className="font-mono text-xs text-atlas">Ley No. 118/2014</div><div className="mt-1 text-sm text-text">Foreign Investment Law — the statute.</div></div>
          <div className="card p-3"><div className="font-mono text-xs text-atlas">Decreto 325/2018</div><div className="mt-1 text-sm text-text">Regulation implementing Law 118.</div></div>
          <div className="card p-3"><div className="font-mono text-xs text-atlas">Resolución MINCEX 207/2018</div><div className="mt-1 text-sm text-text">Methodology for the technical-economic study / business plan.</div></div>
        </div>

        {/* The 7 stages */}
        <h2 className="mt-10 text-2xl font-bold">The approval process — stage by stage</h2>
        <p className="prose-cuba mt-2">
          A foreign investor does not file directly. A Cuban sponsor — the Central State Administration
          body (OACE) or national entity that owns the opportunity — carries the proposal through the
          state machinery. Statutory clock: a decision within{" "}
          <strong className="text-text">60 days</strong> of MINCEX accepting the proposal.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Step n="1" title="Enter via the Cartera de Oportunidades">
            Identify a project in MINCEX&apos;s official opportunity portfolio (or propose one a Cuban
            entity will sponsor). The portfolio is approved by the Council of Ministers and is the
            normal entry point. See the <Link href="/entities" className="link">controlling entities</Link>.
          </Step>
          <Step n="2" title="Negotiate with the Cuban partner">
            Agree heads of terms with the sponsoring state entity (or, for a JV, the Cuban partner):
            scope, contributions, valuations, term, governance.
          </Step>
          <Step n="3" title="Assemble the dossier">
            Prepare the legal and economic documents per Law 118, Decreto 325 and{" "}
            <strong className="text-text">Resolución 207/2018</strong> — a <strong className="text-text">business
            plan</strong> (which has replaced the old feasibility study), the draft association
            agreement/contract and bylaws, and due-diligence/valuation papers.
          </Step>
          <Step n="4" title="Submit to MINCEX" deadline="5 days to admit">
            The Cuban sponsor files with the Ministry of Foreign Trade &amp; Investment (MINCEX), which
            has <strong className="text-text">5 calendar days</strong> to admit or reject the proposal.
          </Step>
          <Step n="5" title="Evaluation Commission review" deadline="15 days">
            If admitted, the Foreign Investment Business Evaluation Commission (advisory to the
            Minister) evaluates it within <strong className="text-text">15 calendar days</strong>.
          </Step>
          <Step n="6" title="Authorization by the competent body" deadline="within the 60-day clock">
            Approval is issued by the body that matches the deal (see authorities below): the{" "}
            <strong className="text-text">Council of State</strong>, the <strong className="text-text">Council
            of Ministers</strong>, or a <strong className="text-text">delegated ministry head</strong>.
          </Step>
          <Step n="7" title="Constitute &amp; register">
            On authorization, execute the public deed, register in the Registro Mercantil, obtain the
            tax registry (ONAT), environmental license (CITMA) and any sector permits, then capitalize
            and open bank accounts.
          </Step>
        </div>

        {/* Who approves */}
        <h2 className="mt-10 text-xl font-semibold">Who must approve — and when</h2>
        <ul className="prose-cuba mt-2">
          <li><strong className="text-text">Council of State</strong> — the most sensitive deals: exploitation of natural resources, public services/utilities, large public-works concessions, the enterprise systems of the armed forces, and wholly-foreign-owned enterprises in such areas.</li>
          <li><strong className="text-text">Council of Ministers</strong> — the general approval authority for most foreign investments and the body that approves the Cartera de Oportunidades.</li>
          <li><strong className="text-text">Delegated ministry heads (OACE)</strong> — under <Src href="https://inviertaencuba.mincex.gob.cu/es/marco-legal/">Acuerdo 8732/2019</Src>, heads of central-administration bodies may authorize International Economic Association Contracts for productive/service administration and their modifications — the streamlined lane.</li>
        </ul>

        {/* Vehicles */}
        <h2 className="mt-10 text-2xl font-bold">The three vehicles</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="card p-4">
            <div className="kicker text-private">Empresa mixta</div>
            <h3 className="mt-1 font-semibold text-text">Joint venture</h3>
            <p className="mt-2 text-sm text-fog">A new Cuban legal entity (S.A. with nominative shares) co-owned by Cuban and foreign partners in agreed proportions. Separate legal personality; governed by an association agreement + bylaws. The most common form.</p>
          </div>
          <div className="card p-4">
            <div className="kicker text-private">Contrato de AEI</div>
            <h3 className="mt-1 font-semibold text-text">Association contract</h3>
            <p className="mt-2 text-sm text-fog">A contractual association with <strong className="text-text">no new legal entity</strong> — each party keeps its own. Used for hotel-management, production, and administration contracts. The lane delegated to ministry heads.</p>
          </div>
          <div className="card p-4">
            <div className="kicker text-private">Capital 100% extranjero</div>
            <h3 className="mt-1 font-semibold text-text">Wholly-foreign-owned</h3>
            <p className="mt-2 text-sm text-fog">The foreign investor operates alone — as a Cuban-registered entity, a branch, or a natural person. Permitted in law but historically the rarest; sensitive sectors route to the Council of State.</p>
          </div>
        </div>

        {/* Capital + tax */}
        <h2 className="mt-10 text-2xl font-bold">Money: contributions, tax &amp; transfers</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div className="card p-5">
            <div className="kicker mb-2">Capital contributions</div>
            <ul className="space-y-1.5 text-sm text-fog">
              <li>• In freely convertible currency, machinery/equipment, intellectual-property rights, or other assets.</li>
              <li>• Valuations are set by agreement between the parties (free valuation).</li>
              <li>• Foreigners cannot own land — they receive <strong className="text-text">usufruct / surface rights</strong> (up to 99 years) and may own buildings/improvements.</li>
            </ul>
          </div>
          <div className="card p-5">
            <div className="kicker mb-2">The special tax regime</div>
            <ul className="space-y-1.5 text-sm text-fog">
              <li>• <strong className="text-text">Profit tax: 15%</strong> on net taxable profit — after an <strong className="text-text">8-year exemption</strong> (renewable/longer by the Council of Ministers).</li>
              <li>• <strong className="text-text">Tax on use of labor force: exempt.</strong></li>
              <li>• Sales/services tax exempt in year one, then reduced rates; customs incentives on imported inputs.</li>
              <li>• <strong className="text-text">Dividends/profits transfer abroad: free, in convertible currency, no transfer tax.</strong></li>
            </ul>
          </div>
        </div>

        {/* Labor */}
        <h2 className="mt-10 text-xl font-semibold">The labor regime — the employing entity</h2>
        <p className="prose-cuba mt-2">
          A foreign-invested business generally cannot hire Cuban workers directly. Cuban (and
          permanently-resident) staff — except the management/administrative body — are contracted
          through a Cuban <strong className="text-text">employing entity (agencia empleadora)</strong>:
          the investor pays the agency in hard currency, and the agency pays workers in Cuban pesos.
          This is one of the most-cited friction points for foreign investors.
        </p>

        {/* Guarantees */}
        <h2 className="mt-10 text-xl font-semibold">Investor guarantees &amp; disputes</h2>
        <ul className="prose-cuba mt-2">
          <li>Full protection; <strong className="text-text">no expropriation</strong> except declared public utility, with indemnification at commercial value in convertible currency.</li>
          <li>Free transfer abroad of profits and of the proceeds from selling the foreign stake.</li>
          <li>Disputes: Cuban courts by default, but international commercial arbitration is permitted (e.g. the Cuban Court of International Commercial Arbitration), and Cuba has bilateral investment-protection treaties with many countries — <strong className="text-text">not the U.S.</strong></li>
        </ul>

        {/* Mariel */}
        <h2 className="mt-10 text-xl font-semibold">The fast-track: Mariel Special Development Zone</h2>
        <p className="prose-cuba mt-2">
          Inside <strong className="text-text">ZED Mariel</strong> (Decreto-Ley 313) a separate regime
          applies, administered by the Oficina de la ZEDM rather than the full Council-of-Ministers
          path: up to <strong className="text-text">100% foreign ownership</strong>, a longer
          profit-tax holiday (commonly ~10 years, then a reduced rate), a 1% labor-contribution rate,
          and customs exemptions — designed to approve qualifying projects faster. Still U.S.-restricted
          (the zone land sits under GAESA&apos;s Almacenes Universales — see <Link href="/entities/almacenes-universales" className="link">/entities</Link>).
        </p>

        {/* Document checklist */}
        <h2 className="mt-10 text-xl font-semibold">Document checklist</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {[
            "Business plan (per Resolución 207/2018 — replaces the feasibility study)",
            "Draft association agreement / AEI contract",
            "Draft bylaws (estatutos) for a joint-venture S.A.",
            "Corporate due-diligence on the foreign investor (good standing, beneficial ownership)",
            "Asset valuations and contribution schedule",
            "Environmental impact documentation (CITMA) where applicable",
            "Sector licenses / permits as applicable",
            "Sponsoring Cuban entity's endorsement to MINCEX",
          ].map((d) => (
            <li key={d} className="card flex gap-2 p-3 text-sm text-fog"><span className="text-invest">✓</span>{d}</li>
          ))}
        </ul>

        <p className="mt-8 text-xs text-ghost">
          Confidence: the seven-stage process, the 5/15/60-day deadlines, Resolución 207/2018, and the
          15% profit tax / 8-year exemption / labor-tax exemption are corroborated across MINCEX
          materials and multiple legal analyses; the Mariel ZED figures and the 99-year usufruct reflect
          the established framework and should be re-confirmed against current resolutions with counsel.
          See <Link href="/legal" className="link">What&apos;s allowed</Link> and{" "}
          <Link href="/data" className="link">Data &amp; methodology</Link>.{" "}
          <strong className="text-text">Research, not legal advice.</strong>
        </p>
      </div>
    </div>
  );
}
