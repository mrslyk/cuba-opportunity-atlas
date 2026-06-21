import type { Opportunity, Claim } from "./types";

/* ─────────────────────────────────────────────────────────────────────────────
   THE COMPLIANCE ENGINE (§0 / §10 hard rules).

   Every "Invest" affordance in the entire app MUST resolve through canInvest().
   There is intentionally no other code path that renders an Invest CTA.
   ──────────────────────────────────────────────────────────────────────────── */

export type SanctionFlags = {
  crl: boolean; // Cuba Restricted List (§515.209)
  sdn: boolean; // OFAC SDN
  cpal: boolean; // Cuba Prohibited Accommodations List
  refs: string[]; // human-readable citations for whatever matched
};

export const NO_FLAGS: SanctionFlags = { crl: false, sdn: false, cpal: false, refs: [] };

export function isSanctioned(f: SanctionFlags | undefined): boolean {
  return !!f && (f.crl || f.sdn || f.cpal);
}

/**
 * The single gate. Invest is permitted ONLY when the asset is explicitly a
 * private-sector Layer-1 entry AND nothing about its controlling entity hits a
 * sanctions list. Belt and suspenders: even a data error that set investable_us
 * on a sanctioned counterparty cannot produce an Invest button.
 */
export function canInvest(opp: Opportunity, controllerFlags?: SanctionFlags): boolean {
  const baseLegal =
    opp.investable_us === true &&
    opp.ownership === "private" &&
    opp.layer === "invest";
  return baseLegal && !isSanctioned(controllerFlags);
}

export type CtaKind = "invest" | "register-interest";

export function ctaFor(opp: Opportunity, controllerFlags?: SanctionFlags): CtaKind {
  return canInvest(opp, controllerFlags) ? "invest" : "register-interest";
}

/* ── Ownership & legal badges (shown on every marker and card) ──────────────── */

export function ownershipBadge(o: Opportunity) {
  switch (o.ownership) {
    case "private":
      return { label: "Private", dot: "🟢", className: "owner-private" };
    case "jv":
      return { label: "Joint venture", dot: "🟡", className: "owner-jv" };
    default:
      return { label: "State", dot: "🔴", className: "owner-state" };
  }
}

export function legalBadge(opp: Opportunity, controllerFlags?: SanctionFlags) {
  return canInvest(opp, controllerFlags)
    ? { label: "Investable today", icon: "✅", className: "legal-invest" }
    : { label: "Atlas — info only", icon: "ℹ️", className: "legal-atlas" };
}

/* ── Helms-Burton / Title III risk classification ──────────────────────────── */

export type TitleIIILevel = "active" | "potential" | "check" | "none";

export function titleIIILevel(claim?: Claim): TitleIIILevel {
  if (!claim) return "none";
  const t = (claim.title_iii || "").toLowerCase().trim();
  if (!t || t === "none" || t === "none active") return "none";
  // Active litigation signals
  if (/\b(v\.|ongoing|affirmed|scotus|remanded|suit|sued|war)\b/.test(t)) return "active";
  if (t.includes("potential")) return "potential";
  if (t.includes("check")) return "check";
  // Any other non-empty, non-"none" string implies some live exposure.
  return "potential";
}

export function isTitleIIIRisk(claim?: Claim): boolean {
  const lvl = titleIIILevel(claim);
  return lvl === "active" || lvl === "potential" || lvl === "check";
}
