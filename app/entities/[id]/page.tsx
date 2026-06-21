import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { entities, getEntity, assetsControlledBy } from "@/lib/data";
import { OpportunityCard } from "@/components/OpportunityCard";

export function generateStaticParams() {
  return entities.map((e) => ({ id: e.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const e = getEntity(params.id);
  if (!e) return { title: "Not found" };
  return { title: e.name, description: e.role };
}

export default function EntityPage({ params }: { params: { id: string } }) {
  const e = getEntity(params.id);
  if (!e) notFound();
  const controls = assetsControlledBy(e.id);
  const flagged = e.flags.crl || e.flags.sdn || e.flags.cpal;

  return (
    <div className="container-x py-8">
      <Link href="/entities" className="link text-xs">← All entities</Link>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">{e.name}</h1>
      {e.aka.length > 0 && <p className="mt-1 font-mono text-xs text-ghost">aka {e.aka.join(", ")}</p>}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {e.flags.sdn && <span className="badge badge-sdn">🚫 OFAC SDN</span>}
        {e.flags.crl && <span className="badge badge-sdn">🚫 Cuba Restricted List</span>}
        {e.flags.cpal && <span className="badge badge-sdn">🚫 Prohibited Accommodations</span>}
        {!flagged && <span className="badge badge-muted">State — embargo-restricted</span>}
      </div>

      <p className="prose-cuba mt-4">{e.role}</p>

      {e.flags.refs.length > 0 && (
        <div className="mt-4 card border-sdn/40 bg-sdn/5 p-4">
          <div className="kicker mb-1 text-[#fca5a5]">Sanctions cross-reference (auto-matched)</div>
          <ul className="space-y-1 text-sm text-fog">
            {e.flags.refs.map((r) => (
              <li key={r} className="font-mono text-xs">• {r}</li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="mt-8 text-xl font-semibold">
        Assets controlled {controls.length > 0 && <span className="text-ghost">({controls.length})</span>}
      </h2>
      {controls.length === 0 ? (
        <p className="mt-2 text-sm text-fog">
          {e.type === "gatekeeper"
            ? "Does not own assets directly — it approves the deals. Every state privatization passes through this gate."
            : "Sub-entity / settlement counterparty. Relevant to compliance screening rather than a specific mapped asset."}
        </p>
      ) : (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {controls.map((o) => (
            <OpportunityCard key={o.id} o={o} />
          ))}
        </div>
      )}

      {e.sources.length > 0 && (
        <div className="mt-6 text-xs text-ghost">
          <span className="kicker">Sources: </span>
          {e.sources.map((s, i) => (
            <span key={i}>
              {s.url ? <a href={s.url} className="link" target="_blank" rel="noopener noreferrer">{s.name}</a> : s.name}
              {i < e.sources.length - 1 ? " · " : ""}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
