import rawOpps from "@/data/opportunities.json";
import rawCrl from "@/data/cuba_restricted_list.json";
import rawSdn from "@/data/cuba_sdn.json";
import rawCpal from "@/data/cpal.json";
import rawEntities from "@/data/entities.json";
import rawMacro from "@/data/cuba_macro.json";

import {
  OpportunitiesSchema,
  CrlSchema,
  SdnSchema,
  CpalSchema,
  EntitiesSchema,
  MacroSchema,
  type Opportunity,
  type ControllingEntity,
} from "./types";
import {
  canInvest,
  isSanctioned,
  titleIIILevel,
  type SanctionFlags,
  type TitleIIILevel,
} from "./compliance";

/* ── Validate the whole corpus at module load (build-time gate) ─────────────── */
export const opportunities = OpportunitiesSchema.parse(rawOpps);
export const crl = CrlSchema.parse(rawCrl);
export const sdn = SdnSchema.parse(rawSdn);
export const cpal = CpalSchema.parse(rawCpal);
export const entitiesFile = EntitiesSchema.parse(rawEntities);
export const macro = MacroSchema.parse(rawMacro);

/* ── Build fast lookup indexes from the official lists ──────────────────────── */
const crlNames: { name: string; aka: string[] }[] = crl.categories.flatMap((c) =>
  c.entities.map((e) => ({ name: e.name, aka: e.aka ?? [] }))
);
const sdnNames = sdn.sdn_entries.map((e) => e.name);

function matchList(keys: string[], haystack: string[]): string | null {
  const lowerHay = haystack.map((h) => h.toLowerCase());
  for (const k of keys) {
    const kl = k.toLowerCase();
    const hit = lowerHay.findIndex((h) => h.includes(kl));
    if (hit !== -1) return haystack[hit];
  }
  return null;
}

/** Compute CRL/SDN/CPAL flags for a set of match keys against the ingested lists. */
export function flagsForKeys(keys: string[]): SanctionFlags {
  if (!keys.length) return { crl: false, sdn: false, cpal: false, refs: [] };
  const refs: string[] = [];

  const crlHit = matchList(keys, crlNames.flatMap((c) => [c.name, ...c.aka]));
  if (crlHit) refs.push(`Cuba Restricted List: ${crlHit}`);

  const sdnHit = matchList(keys, sdnNames);
  if (sdnHit) {
    const entry = sdn.sdn_entries.find((e) => e.name === sdnHit);
    refs.push(`OFAC SDN: ${sdnHit}${entry?.date_designated ? ` (${entry.date_designated})` : ""}`);
  }

  const cpalHit = matchList(
    keys,
    cpal.properties.map((p) => p.name)
  );
  if (cpalHit) refs.push(`Prohibited Accommodations List: ${cpalHit}`);

  return { crl: !!crlHit, sdn: !!sdnHit, cpal: !!cpalHit, refs };
}

/* ── Controlling-entity registry, with auto-computed sanctions flags ────────── */
export type EnrichedEntity = ControllingEntity & { flags: SanctionFlags };

export const entities: EnrichedEntity[] = entitiesFile.entities.map((e) => ({
  ...e,
  flags: flagsForKeys([...(e.aka ?? []), ...(e.match ?? []), e.name]),
}));

const entityById = new Map(entities.map((e) => [e.id, e]));

/** opportunity id -> controlling entity (reverse map from entities.controls). */
const controllerOf = new Map<string, EnrichedEntity>();
for (const e of entities) for (const oid of e.controls) controllerOf.set(oid, e);

/* ── The enriched opportunity the UI consumes ──────────────────────────────── */
export type EnrichedOpportunity = Opportunity & {
  controller: EnrichedEntity | null;
  flags: SanctionFlags; // controller flags ∪ direct name matches in notes
  investable: boolean; // final, engine-decided
  titleIII: TitleIIILevel;
};

function combineFlags(a: SanctionFlags, b: SanctionFlags): SanctionFlags {
  return {
    crl: a.crl || b.crl,
    sdn: a.sdn || b.sdn,
    cpal: a.cpal || b.cpal,
    refs: Array.from(new Set([...a.refs, ...b.refs])),
  };
}

export const enriched: EnrichedOpportunity[] = opportunities.map((o) => {
  const controller = controllerOf.get(o.id) ?? null;
  // Also scan the asset's own notes/name for any list hit (catches controllers
  // we didn't map explicitly, e.g. "Moa Nickel S.A." named in notes).
  const directKeys = [o.name, o.notes ?? ""].filter(Boolean);
  const direct = flagsForKeys(directKeys);
  const flags = controller ? combineFlags(controller.flags, direct) : direct;
  return {
    ...o,
    controller,
    flags,
    investable: canInvest(o, flags),
    titleIII: titleIIILevel(o.claim),
  };
});

const byId = new Map(enriched.map((o) => [o.id, o]));
export function getOpportunity(id: string): EnrichedOpportunity | undefined {
  return byId.get(id);
}

/* ── Derived collections for the pages ─────────────────────────────────────── */
export const investable = enriched.filter((o) => o.investable);
export const atlasOnly = enriched.filter((o) => !o.investable);
export const confiscated = enriched.filter((o) => o.confiscated && o.claim);
export const titleIIIRiskAssets = confiscated.filter(
  (o) => o.titleIII === "active" || o.titleIII === "potential" || o.titleIII === "check"
);

export const sectors = Array.from(new Set(enriched.map((o) => o.sector))).sort();
export const provinces = Array.from(new Set(enriched.map((o) => o.province))).sort();

/* Slim, serializable shape passed to the client-side map. */
export type MapPoint = {
  id: string;
  name: string;
  sector: string;
  province: string;
  ownership: Opportunity["ownership"];
  lat: number;
  lng: number;
  layer: Opportunity["layer"];
  investable: boolean;
  confiscated: boolean;
  titleIII: TitleIIILevel;
  sanctioned: boolean;
  needsBuild: boolean;
  status: string;
  type: string;
};

const BUILD_SIGNALS = /distress|idle|abandon|unfinished|never|deteriorat|degrad|stall|collaps|crisis|rebuild|recapitaliz|moderniz|overhaul|revival|brownfield|greenfield|expansion|reconstruction|bottleneck|needs/i;

export function toMapPoint(o: EnrichedOpportunity): MapPoint {
  return {
    id: o.id,
    name: o.name,
    sector: o.sector,
    province: o.province,
    ownership: o.ownership,
    lat: o.lat,
    lng: o.lng,
    layer: o.layer,
    investable: o.investable,
    confiscated: !!o.confiscated,
    titleIII: o.titleIII,
    sanctioned: isSanctioned(o.flags),
    needsBuild: BUILD_SIGNALS.test(`${o.status} ${o.type}`),
    status: o.status ?? "",
    type: o.type ?? "",
  };
}

export const mapPoints: MapPoint[] = enriched.map(toMapPoint);

export function getEntity(id: string): EnrichedEntity | undefined {
  return entityById.get(id);
}
export function assetsControlledBy(entityId: string): EnrichedOpportunity[] {
  const e = entityById.get(entityId);
  if (!e) return [];
  return e.controls.map((id) => byId.get(id)).filter(Boolean) as EnrichedOpportunity[];
}

/* ── Build-time invariant guard (§10): no investable asset may have a
   sanctioned controller, and the investable set must be exactly the
   private/invest/investable_us records. Throws → fails `next build`. ────────── */
(function assertInvariants() {
  for (const o of enriched) {
    if (o.investable && isSanctioned(o.flags)) {
      throw new Error(
        `COMPLIANCE INVARIANT BROKEN: ${o.id} is investable but its counterparty is sanctioned (${o.flags.refs.join("; ")}).`
      );
    }
    if (o.investable && (o.ownership !== "private" || o.layer !== "invest")) {
      throw new Error(`COMPLIANCE INVARIANT BROKEN: ${o.id} marked investable without private/invest status.`);
    }
  }
})();
