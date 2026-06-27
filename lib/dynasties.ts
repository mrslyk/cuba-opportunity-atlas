/* Maps a confiscated asset's claim.owner to a profiled family in the standalone
   Dynasties page (public/dynasties.html). Matching is by the family/brand named
   in the claim — the single place that knows which dynasties have a deep link.

   Profiled but intentionally unmapped (no matching confiscated asset in the data
   yet): fanjul, lobo, mascanosa, mestre. The only sugar claim is United Fruit,
   a U.S. corporation — not the Fanjul/Lobo family — so sugar stays unlinked.
   Add a matcher here the moment such an asset is added. */

export const DYNASTIES_URL = "/dynasties.html";

export type Dynasty = { anchor: string; family: string };

const OWNER_MATCHERS: { test: RegExp; anchor: string; family: string }[] = [
  { test: /bacard/i, anchor: "bacardi", family: "the Bacardí family" },
  { test: /arechabala/i, anchor: "arechabala", family: "the Arechabala family" },
  { test: /cifuentes/i, anchor: "cifuentes", family: "the Cifuentes family" },
  { test: /men[eé]ndez/i, anchor: "menendez", family: "the Menéndez family" },
];

/* Returns the matching dynasty (anchor + family label) for a claim, or null. */
export function dynastyFor(claim?: { owner?: string } | null): Dynasty | null {
  const owner = claim?.owner;
  if (!owner) return null;
  const m = OWNER_MATCHERS.find((x) => x.test.test(owner));
  return m ? { anchor: m.anchor, family: m.family } : null;
}

/* Convenience: the full deep-link URL for a claim, or null if unmatched. */
export function dynastyHref(claim?: { owner?: string } | null): string | null {
  const d = dynastyFor(claim);
  return d ? `${DYNASTIES_URL}#${d.anchor}` : null;
}
