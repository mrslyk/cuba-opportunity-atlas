import type { Metadata } from "next";
import Link from "next/link";
import { confiscated, getOpportunity, sdn } from "@/lib/data";
import { sectorMeta } from "@/lib/sectors";

export const metadata: Metadata = {
  title: "Helms-Burton / Rightful Owners",
  description:
    "Every confiscated asset in the atlas, its original owner, certified 1972 value, current claim-holder, and Title III status — led by the May 21 2026 Havana Docks Supreme Court ruling.",
};

const rank = { active: 0, potential: 1, check: 2, none: 3 } as const;

export default function ClaimsPage() {
  const havanaDocks = getOpportunity("claim-havana-docks");
  const rest = confiscated
    .filter((o) => o.id !== "claim-havana-docks")
    .sort((a, b) => rank[a.titleIII] - rank[b.titleIII] || a.name.localeCompare(b.name));
  const scotus = sdn.key_dates.find((d) => d.date === "2026-05-21");

  const activeCount = confiscated.filter((o) => o.titleIII === "active").length;
  const certifiedCount = confiscated.filter((o) => o.claim?.certified).length;

  return (
    <div className="container-x py-8">
      <div className="kicker mb-2 text-risk">Helms-Burton · Title III · Rightful Owners</div>
      <h1 className="text-3xl font-bold tracking-tight">Confiscated property &amp; the claims map</h1>
      <p className="prose-cuba mt-3">
        Helms-Burton Title III lets U.S. nationals sue anyone &quot;trafficking&quot; in property
        confiscated by the Cuban government after 1959 — for treble damages. Any investor touching a
        confiscated asset inherits that liability. These are the landmines under the atlas.
      </p>

      {/* Dynasties feature link */}
      <a
        href="/dynasties.html"
        className="group mt-5 flex items-center justify-between gap-4 rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 transition-colors hover:border-private/50"
      >
        <div>
          <div className="font-semibold text-text">The families behind the claims →</div>
          <p className="mt-0.5 text-sm text-fog">
            Meet the eight Cuban dynasties whose property was confiscated in 1960 — Bacardí,
            Arechabala, Fanjul, Lobo, Cifuentes, Menéndez, Mas Canosa and Mestre.
          </p>
        </div>
        <span className="hidden text-2xl text-private transition-transform group-hover:translate-x-0.5 sm:block">→</span>
      </a>

      {/* Havana Docks hero */}
      {havanaDocks?.claim && (
        <section className="mt-6 overflow-hidden rounded-xl border border-risk/50 bg-risk/5">
          <div className="grid gap-6 p-6 md:grid-cols-[1fr_300px]">
            <div>
              <div className="badge badge-risk mb-2">⚠️ Landmark ruling · {scotus?.date ?? "May 21 2026"}</div>
              <h2 className="text-2xl font-bold text-text">
                Havana Docks v. the cruise lines — affirmed by the Supreme Court
              </h2>
              <p className="mt-3 text-sm text-fog">
                On <strong className="text-text">May 21, 2026</strong>, the Supreme Court (8–1)
                affirmed Title III liability against Carnival, Royal Caribbean, Norwegian and MSC for
                using the confiscated Havana cruise terminal — a judgment exceeding{" "}
                <strong className="text-text">$400M trebled</strong>. The ruling{" "}
                <strong className="text-text">broadened</strong> what counts as &quot;trafficking,&quot;
                rejecting the lower-court limit tied to the original concession term. It is the single
                most important reason U.S. capital cannot touch Cuba&apos;s confiscated infrastructure
                — and why this overlay exists.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/opportunity/${havanaDocks.id}`} className="btn btn-ghost text-xs">Open the dossier →</Link>
                <Link href="/compliance" className="btn btn-ghost text-xs">Compliance posture →</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-lg border border-risk/30 bg-risk/20">
              <HeroStat n={havanaDocks.claim.value_1972} label="Claim rank" />
              <HeroStat n="$400M+" label="Trebled judgment" />
              <HeroStat n="8–1" label="SCOTUS vote" />
              <HeroStat n={confiscated.length.toString()} label="Confiscated assets here" />
            </div>
          </div>
        </section>
      )}

      <div className="mt-6 flex flex-wrap gap-3 text-sm text-fog">
        <span className="badge badge-risk">⚠️ {activeCount} active Title III suits</span>
        <span className="badge badge-muted">{certifiedCount} FCSC-certified claims</span>
        <span className="badge badge-muted">{confiscated.length} confiscated assets total</span>
      </div>

      {/* Claims table */}
      <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--line)]">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-[var(--panel-2)] text-xs text-fog">
            <tr>
              <Th>Asset</Th>
              <Th>Original owner (1960)</Th>
              <Th>1972 value</Th>
              <Th>Current claim-holder</Th>
              <Th>Certified</Th>
              <Th>Title III</Th>
            </tr>
          </thead>
          <tbody>
            {rest.map((o) => (
              <tr key={o.id} className="border-t border-[var(--line)] hover:bg-black/[0.025]">
                <td className="p-3">
                  <Link href={`/opportunity/${o.id}`} className="font-medium text-text hover:underline">{o.name}</Link>
                  <div className="kicker mt-0.5" style={{ color: sectorMeta(o.sector).color }}>{sectorMeta(o.sector).label}</div>
                </td>
                <td className="p-3 text-fog">{o.claim?.owner}</td>
                <td className="p-3 font-mono text-fog">{o.claim?.value_1972}</td>
                <td className="p-3 text-fog">{o.claim?.current_holder}</td>
                <td className="p-3">{o.claim?.certified ? <span className="badge badge-muted">Certified</span> : <span className="text-ghost">—</span>}</td>
                <td className="p-3">
                  {o.titleIII === "active" ? <span className="badge badge-risk">⚠️ Active</span>
                    : o.titleIII === "potential" ? <span className="badge badge-risk">⚠️ Potential</span>
                    : o.titleIII === "check" ? <span className="badge badge-muted">Review</span>
                    : <span className="text-ghost">None active</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-ghost">
        Certified values are the U.S. Foreign Claims Settlement Commission (FCSC) 1972 figures;
        statutory interest makes present values far higher. Uncertified claims may still support
        Title III suits. Not legal advice.
      </p>
    </div>
  );
}

function HeroStat({ n, label }: { n: string; label: string }) {
  return (
    <div className="bg-[var(--panel)] p-3">
      <div className="font-mono text-lg font-bold text-risk">{n}</div>
      <div className="text-[11px] text-fog">{label}</div>
    </div>
  );
}
function Th({ children }: { children: React.ReactNode }) {
  return <th className="p-3 font-medium">{children}</th>;
}
