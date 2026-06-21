import type { Metadata } from "next";
import Link from "next/link";
import { entities, assetsControlledBy, crl, cpal } from "@/lib/data";

export const metadata: Metadata = {
  title: "Controlling entities",
  description:
    "The Cuban state, military (GAESA) and line-ministry entities that own and gatekeep Cuba's infrastructure — who controls the privatizations, and which are sanctioned.",
};

const TYPE_LABEL: Record<string, string> = {
  "military-holding": "Military · GAESA",
  "state-holding": "State holding",
  "state-utility": "State utility",
  "joint-venture": "Joint venture",
  gatekeeper: "FDI gatekeeper",
};

export default function EntitiesPage() {
  const sanctioned = entities.filter((e) => e.flags.crl || e.flags.sdn || e.flags.cpal);
  return (
    <div className="container-x py-8">
      <div className="kicker mb-2">Who controls the privatization</div>
      <h1 className="text-3xl font-bold tracking-tight">Controlling government &amp; state entities</h1>
      <p className="prose-cuba mt-3">
        Every state asset in the atlas answers to one of these entities — and the most important
        ones are military-controlled (GAESA) and legally untouchable. This is the map of who you
        would have to deal with to take over Cuba&apos;s infrastructure, and who U.S. persons{" "}
        <strong className="text-text">legally cannot</strong>. Sanctions flags below are computed by
        cross-referencing each entity against the ingested Cuba Restricted List ({crl.categories.reduce((n, c) => n + c.entities.length, 0)} entities),
        the OFAC SDN list, and the Prohibited Accommodations List ({cpal.properties.length} hotels).
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {entities.map((e) => {
          const controls = assetsControlledBy(e.id);
          const flagged = e.flags.crl || e.flags.sdn || e.flags.cpal;
          return (
            <Link
              key={e.id}
              href={`/entities/${e.id}`}
              className={`card card-hover p-5 ${flagged ? "border-sdn/40" : ""}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="kicker">{TYPE_LABEL[e.type] ?? e.type}</div>
                  <h2 className="mt-1 font-semibold text-text">{e.name}</h2>
                </div>
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-fog">{e.role}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {e.flags.sdn && <span className="badge badge-sdn">🚫 SDN</span>}
                {e.flags.crl && <span className="badge badge-sdn">🚫 Restricted List</span>}
                {e.flags.cpal && <span className="badge badge-sdn">🚫 CPAL</span>}
                {!flagged && <span className="badge badge-muted">State — embargo-restricted</span>}
                {controls.length > 0 && <span className="badge badge-muted">{controls.length} assets</span>}
              </div>
            </Link>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-ghost">
        ⚠️ {sanctioned.length} of {entities.length} listed entities are on a U.S. sanctions list.
        State utilities/ministries not on the CRL/SDN (UNE, CUPET, INRH, ECASA) remain
        embargo-restricted for U.S. persons. Screening must use the live OFAC/State sources.
      </p>
    </div>
  );
}
