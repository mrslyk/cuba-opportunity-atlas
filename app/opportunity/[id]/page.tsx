import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { enriched, getOpportunity } from "@/lib/data";
import { sectorMeta } from "@/lib/sectors";
import { OwnershipBadge, LegalBadge, TitleIIIBadge, SanctionBadges } from "@/components/Badges";
import { DisclosureBanner } from "@/components/DisclosureBanner";
import { InvestCta } from "@/components/InvestCta";
import { InterestForm } from "@/components/InterestForm";
import { ClaimPanel } from "@/components/ClaimPanel";

export function generateStaticParams() {
  return enriched.map((o) => ({ id: o.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const o = getOpportunity(params.id);
  if (!o) return { title: "Not found" };
  return { title: o.name, description: o.status || o.type };
}

export default function OpportunityPage({ params }: { params: { id: string } }) {
  const o = getOpportunity(params.id);
  if (!o) notFound();
  const m = sectorMeta(o.sector);

  return (
    <div>
      <DisclosureBanner />
      <article className="container-x grid gap-8 py-8 lg:grid-cols-[1fr_360px]">
        {/* Main */}
        <div>
          <Link href="/map" className="link text-xs">← Back to map</Link>
          <div className="kicker mt-3" style={{ color: m.color }}>{m.label} · {o.province}</div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">{o.name}</h1>
          <p className="mt-2 text-fog">{o.type}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            <OwnershipBadge o={o} />
            <LegalBadge o={o} />
            <SanctionBadges o={o} />
            <TitleIIIBadge o={o} />
          </div>

          <dl className="mt-6 grid gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
            <Cell label="Scale" value={o.scale} />
            <Cell label="Status" value={o.status} />
            <Cell label="Sector" value={m.label} />
            <Cell label="Province" value={o.province} />
            <Cell label="Coordinates" value={`${o.lat.toFixed(3)}, ${o.lng.toFixed(3)}`} mono />
            <Cell label="Layer" value={o.layer === "invest" ? "Layer 1 · Invest" : "Layer 2 · Atlas"} />
          </dl>

          {o.notes && (
            <div className="mt-4 rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4 text-sm text-fog">
              <div className="kicker mb-1">Notes</div>
              {o.notes}
            </div>
          )}

          {/* Controller */}
          {o.controller && (
            <div className="mt-4 card p-4">
              <div className="kicker mb-1">Controlling entity</div>
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/entities/${o.controller.id}`} className="font-semibold text-text hover:underline">
                  {o.controller.name}
                </Link>
                {o.controller.flags.sdn && <span className="badge badge-sdn">🚫 SDN</span>}
                {o.controller.flags.crl && <span className="badge badge-sdn">🚫 Restricted List</span>}
                {o.controller.flags.cpal && <span className="badge badge-sdn">🚫 CPAL</span>}
              </div>
              <p className="mt-2 text-sm text-fog">{o.controller.role}</p>
            </div>
          )}

          {/* Claim panel */}
          {o.confiscated && o.claim && <ClaimPanel o={o} className="mt-4" />}

          {o.sources.length > 0 && (
            <div className="mt-4 text-xs text-ghost">
              <span className="kicker">Sources: </span>
              {o.sources.join(" · ")}
            </div>
          )}
        </div>

        {/* Sidebar — the conditional CTA (compliance engine decides) */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {o.investable ? (
            <InvestCta investable={o.investable} assetName={o.name} />
          ) : (
            <div>
              <div className="mb-2 text-sm font-semibold text-text">Register interest</div>
              <p className="mb-3 text-xs text-fog">
                Not investable by U.S. persons today. Register a non-binding indication for the
                pipeline — for non-U.S. capital or a post-sanctions world.
              </p>
              <InterestForm assetId={o.id} assetName={o.name} />
            </div>
          )}
          <DisclosureBanner variant="inline" />
        </aside>
      </article>
    </div>
  );
}

function Cell({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
  return (
    <div className="bg-[var(--panel)] p-3">
      <div className="kicker">{label}</div>
      <div className={`mt-0.5 text-sm text-text ${mono ? "font-mono" : ""}`}>{value || "—"}</div>
    </div>
  );
}
