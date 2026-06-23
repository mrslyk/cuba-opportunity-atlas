import Link from "next/link";
import type { ReformCard as Card } from "@/lib/types";

/* Map-tag → destination. Spatial tags filter the map; thematic tags point at the
   relevant framework section; analytic tags are plain labels (no destination). */
const TAG_ROUTE: Record<string, { label: string; href: string | null }> = {
  energy: { label: "energy", href: "/map?sector=energy" },
  agriculture: { label: "agriculture", href: "/map?sector=agriculture" },
  tourism: { label: "tourism", href: "/map?sector=tourism" },
  "private-sector": { label: "private sector", href: "/map?sector=private-sector" },
  logistics: { label: "logistics", href: "/map?recovery=logistics" },
  "diaspora-finance": { label: "diaspora finance", href: "/invest" },
  "property-rights": { label: "property rights", href: "/claims" },
  sequencing: { label: "sequencing", href: null },
};

function tagMeta(tag: string) {
  return TAG_ROUTE[tag] ?? { label: tag.replace(/-/g, " "), href: "/map?recovery=1" };
}

function fmtDate(d: string) {
  const [y, m] = d.split("-");
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return m ? `${months[parseInt(m, 10)] ?? m} ${y}` : y;
}

export function ReformCard({ card }: { card: Card }) {
  const pending = card.url_status === "pending_canonical";
  return (
    <article className="card p-5">
      {/* Attribution header — always rendered (§0) */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
        <span className="font-mono font-medium text-atlas">{card.source}</span>
        {card.edition && <span className="badge badge-muted">Ed. {card.edition}</span>}
        <span className="text-ghost">· {fmtDate(card.date)}</span>
      </div>
      <h3 className="mt-2 text-lg font-semibold text-text">{card.title}</h3>
      <div className="mt-1 text-xs text-ghost">
        {card.authors.join(", ")} — <span className="text-fog">{card.publisher}</span>
      </div>

      <p className="mt-3 text-sm text-fog">{card.synopsis}</p>

      {card.key_stat && (
        <p className="mt-3 rounded-md border border-[var(--line)] bg-[var(--panel-2)] px-3 py-2 font-mono text-xs text-text">
          {card.key_stat}
        </p>
      )}

      {card.why_matters && (
        <p className="mt-3 text-xs text-fog"><span className="kicker">Why it matters · </span>{card.why_matters}</p>
      )}

      {/* Map-impact tags */}
      {card.map_tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {card.map_tags.map((t) => {
            const m = tagMeta(t);
            return m.href ? (
              <Link key={t} href={m.href} className="badge badge-muted hover:border-brand2/40 hover:text-text">#{m.label}</Link>
            ) : (
              <span key={t} className="badge badge-muted opacity-70">#{m.label}</span>
            );
          })}
        </div>
      )}

      {/* Footer: outbound attribution link + curator */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] pt-3 text-xs">
        {pending ? (
          <a href={card.url} target="_blank" rel="noopener noreferrer" className="link">
            {card.publisher.split(" / ")[0]} → <span className="text-ghost">(English edition — link pending)</span>
          </a>
        ) : (
          <a href={card.url} target="_blank" rel="noopener noreferrer" className="link">Read original →</a>
        )}
        {card.curated_by && <span className="text-ghost">Digest by {card.curated_by}</span>}
      </div>
    </article>
  );
}
