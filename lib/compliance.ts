import type { Opportunity, Claim } from "./types";

/* ─────────────────────────────────────────────────────────────────────────────
   THE COMPLIANCE ENGINE (§0 / §10 hard rules).

   There is NO equity-investment lane. U.S. persons do not buy equity in Cuban
   entities. The only authorized participation is REMITTANCE / PAYMENT SUPPORT to
   the licensed independent private sector, routed through QvaPay under OFAC
   general licenses (31 CFR §515.570 remittances, §515.578 internet-based
   services, §515.542). Every "Support" affordance routes through canSupport().
   ──────────────────────────────────────────────────────────────────────────── */

export type SanctionFlags = {
  crl: boolean; // Cuba Restricted List (§515.209)
  sdn: boolean; // OFAC SDN
  cpal: boolean; // Cuba Prohibited Accommodations List
  refs: string[];
};

export const NO_FLAGS: SanctionFlags = { crl: false, sdn: false, cpal: false, refs: [] };

export function isSanctioned(f: SanctionFlags | undefined): boolean {
  return !!f && (f.crl || f.sdn || f.cpal);
}

/**
 * The single gate. Support (via QvaPay) is permitted ONLY when the asset is an
 * explicitly licensed private-sector 'opportunity' entry AND nothing about its
 * counterparty hits a sanctions list. Belt and suspenders: a data error cannot
 * surface a Support button on a state/JV/sanctioned/atlas asset.
 */
export function canSupport(opp: Opportunity, controllerFlags?: SanctionFlags): boolean {
  const baseLegal =
    opp.participation === "support_via_qvapay" &&
    opp.ownership === "private" &&
    opp.layer === "opportunity" &&
    opp.investable_us === false;
  return baseLegal && !isSanctioned(controllerFlags);
}

export type CtaKind = "support" | "register-interest";

export function ctaFor(opp: Opportunity, controllerFlags?: SanctionFlags): CtaKind {
  return canSupport(opp, controllerFlags) ? "support" : "register-interest";
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
  return canSupport(opp, controllerFlags)
    ? { label: "Supportable via QvaPay", icon: "✅", className: "legal-invest" }
    : { label: "Atlas — info only", icon: "ℹ️", className: "legal-atlas" };
}

/* ── Helms-Burton / Title III risk classification ──────────────────────────── */

export type TitleIIILevel = "active" | "potential" | "check" | "none";

export function titleIIILevel(claim?: Claim): TitleIIILevel {
  if (!claim) return "none";
  const t = (claim.title_iii || "").toLowerCase().trim();
  if (!t || t === "none" || t === "none active") return "none";
  if (/\b(v\.|ongoing|affirmed|scotus|remanded|suit|sued|war)\b/.test(t)) return "active";
  if (t.includes("potential")) return "potential";
  if (t.includes("check")) return "check";
  return "potential";
}

export function isTitleIIIRisk(claim?: Claim): boolean {
  const lvl = titleIIILevel(claim);
  return lvl === "active" || lvl === "potential" || lvl === "check";
}
