import Link from "next/link";
import type { EnrichedOpportunity } from "@/lib/data";
import { sectorMeta } from "@/lib/sectors";
import { OwnershipBadge, LegalBadge, TitleIIIBadge, SanctionBadges } from "./Badges";

export function OpportunityCard({ o }: { o: EnrichedOpportunity }) {
  const m = sectorMeta(o.sector);
  return (
    <Link
      href={`/opportunity/${o.id}`}
      className="card card-hover group flex flex-col gap-3 p-4"
      style={{ borderLeft: `3px solid ${m.color}` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="kicker" style={{ color: m.color }}>{m.label} · {o.province}</div>
          <h3 className="mt-1 font-semibold leading-tight text-text group-hover:text-white">{o.name}</h3>
        </div>
      </div>
      <p className="line-clamp-2 text-sm text-fog">{o.status || o.type}</p>
      <div className="mt-auto flex flex-wrap gap-1.5">
        <OwnershipBadge o={o} />
        <LegalBadge o={o} />
        <SanctionBadges o={o} />
        <TitleIIIBadge o={o} />
      </div>
    </Link>
  );
}
