import type { EnrichedOpportunity } from "@/lib/data";
import { ownershipBadge } from "@/lib/compliance";
import { sectorMeta } from "@/lib/sectors";

export function OwnershipBadge({ o }: { o: EnrichedOpportunity }) {
  const b = ownershipBadge(o);
  return <span className={`badge ${b.className}`}>{b.dot} {b.label}</span>;
}

export function LegalBadge({ o }: { o: EnrichedOpportunity }) {
  return o.supportable ? (
    <span className="badge legal-invest">✅ Supportable via QvaPay</span>
  ) : (
    <span className="badge legal-atlas">ℹ️ Atlas — info only</span>
  );
}

export function SectorChip({ sector }: { sector: string }) {
  const m = sectorMeta(sector);
  return (
    <span className="badge badge-muted">
      <span className="inline-block h-2 w-2 rounded-full" style={{ background: m.color }} />
      {m.label}
    </span>
  );
}

export function SanctionBadges({ o }: { o: EnrichedOpportunity }) {
  return (
    <>
      {o.flags.sdn && <span className="badge badge-sdn">🚫 OFAC SDN</span>}
      {o.flags.crl && <span className="badge badge-sdn">🚫 Restricted List</span>}
      {o.flags.cpal && <span className="badge badge-sdn">🚫 CPAL hotel</span>}
    </>
  );
}

export function TitleIIIBadge({ o }: { o: EnrichedOpportunity }) {
  if (!o.confiscated) return null;
  if (o.titleIII === "active") return <span className="badge badge-risk">⚠️ Title III risk — active suit</span>;
  if (o.titleIII === "potential") return <span className="badge badge-risk">⚠️ Title III risk — potential</span>;
  if (o.titleIII === "check") return <span className="badge badge-risk">⚠️ Title III — under review</span>;
  return <span className="badge badge-muted">Confiscated · no active suit</span>;
}
