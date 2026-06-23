"use client";

import { useMemo, useState } from "react";
import type { EcosystemEntry } from "@/lib/types";

const CHIPS = ["on-island", "diaspora", "accelerator", "dev-community", "research", "founder/startup"];
const SECTIONS: { cat: EcosystemEntry["category"]; title: string }[] = [
  { cat: "on-island", title: "On-Island Programs" },
  { cat: "diaspora", title: "Diaspora & U.S.-Based" },
  { cat: "research", title: "Research & Policy" },
];

function matches(e: EcosystemEntry, chip: string | null) {
  if (!chip) return true;
  return e.category === chip || e.tags.includes(chip);
}

function OrgCard({ e }: { e: EcosystemEntry }) {
  return (
    <div className="card card-hover flex flex-col p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-text">{e.name}</h3>
        {e.location && <span className="shrink-0 text-[11px] text-ghost">{e.location}</span>}
      </div>
      <div className="kicker mt-0.5">{e.type}</div>
      <p className="mt-2 text-sm text-fog">{e.blurb}</p>
      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3">
        {e.tags.map((t) => (
          <span key={t} className="badge badge-muted">#{t}</span>
        ))}
        {e.url && (
          <a href={e.url} target="_blank" rel="noopener noreferrer" className="link ml-auto text-xs">Visit →</a>
        )}
      </div>
    </div>
  );
}

export function EcosystemDirectory({ entries }: { entries: EcosystemEntry[] }) {
  const [chip, setChip] = useState<string | null>(null);
  const visible = useMemo(() => entries.filter((e) => matches(e, chip)), [entries, chip]);

  return (
    <div>
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setChip(null)}
          className={`badge ${chip === null ? "legal-invest" : "badge-muted"} px-2.5 py-1`}
        >
          All
        </button>
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => setChip(c === chip ? null : c)}
            className={`badge ${c === chip ? "legal-invest" : "badge-muted"} px-2.5 py-1`}
          >
            {c}
          </button>
        ))}
        <span className="ml-auto self-center font-mono text-[11px] text-ghost">{visible.length} of {entries.length}</span>
      </div>

      <div className="mt-6 space-y-10">
        {SECTIONS.map(({ cat, title }) => {
          const inCat = visible.filter((e) => e.category === cat);
          const orgs = inCat.filter((e) => !e.watchlist);
          const watch = inCat
            .filter((e) => e.watchlist)
            .sort((a, b) => Number(b.featured) - Number(a.featured));
          if (inCat.length === 0) return null;
          return (
            <section key={cat}>
              <div className="flex items-center gap-2 border-b border-[var(--line)] pb-2">
                <h2 className="text-lg font-semibold text-text">{title}</h2>
                <span className="text-xs text-ghost">{inCat.length}</span>
              </div>
              {orgs.length > 0 && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {orgs.map((e) => <OrgCard key={e.id} e={e} />)}
                </div>
              )}
              {watch.length > 0 && (
                <div className="mt-4">
                  <div className="kicker mb-2">Founders to watch</div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {watch.map((e) => (
                      <div key={e.id} className={`card flex items-start gap-3 p-3 ${e.featured ? "border-private/40 bg-private/5" : ""}`}>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-text">{e.name}</span>
                            {e.featured && <span className="badge legal-invest">Powering this Atlas</span>}
                          </div>
                          {e.venture && e.venture !== "—" && <div className="kicker mt-0.5">{e.venture}</div>}
                          <p className="mt-1 text-xs text-fog">{e.blurb}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] text-ghost">Founders shown as examples, not organizations.</p>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
