import type { EnrichedOpportunity } from "@/lib/data";
import { dynastyFor, DYNASTIES_URL } from "@/lib/dynasties";
import { TitleIIIBadge } from "./Badges";

/* Helms-Burton claim dossier for a confiscated asset. */
export function ClaimPanel({ o, className = "" }: { o: EnrichedOpportunity; className?: string }) {
  if (!o.claim) return null;
  const c = o.claim;
  const active = o.titleIII === "active";
  const dynasty = dynastyFor(c);
  return (
    <div className={`card p-4 ${active ? "border-risk/50 bg-risk/5" : ""} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="kicker text-risk">Helms-Burton · confiscated property</div>
        <TitleIIIBadge o={o} />
      </div>
      <dl className="mt-3 grid gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
        <Cell label="Original owner (1960)" value={c.owner} />
        <Cell label="1972 certified value" value={c.value_1972} mono />
        <Cell label="Current claim-holder" value={c.current_holder} />
        <Cell label="Certified (FCSC)" value={c.certified ? "Yes — certified claim" : "No — uncertified"} />
      </dl>
      <div className="mt-3 rounded-md border border-[var(--line)] bg-[var(--panel)] p-3 text-sm">
        <div className="kicker mb-1">Title III status</div>
        <p className={active ? "text-risk" : "text-fog"}>{c.title_iii}</p>
      </div>
      {dynasty && (
        <a
          href={`${DYNASTIES_URL}#${dynasty.anchor}`}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-private hover:underline"
        >
          Read {dynasty.family}&apos;s story →
        </a>
      )}
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
