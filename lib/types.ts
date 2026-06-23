import { z } from "zod";

/* ─────────────────────────────────────────────────────────────────────────────
   Opportunity schema (§4 of the build spec) + Helms-Burton claim extension.
   The refinements here are HARD COMPLIANCE INVARIANTS (§0/§10): the data set
   fails validation at build time if a record contradicts the legal model.
   ──────────────────────────────────────────────────────────────────────────── */

export const Ownership = z.enum(["state", "jv", "private"]);
// "atlas" = state/JV infrastructure, information only.
// "opportunity" = licensed private sector — U.S. persons participate via
// OFAC-authorized remittances/payments through QvaPay (NOT equity investment).
export const Layer = z.enum(["atlas", "opportunity"]);
export const Participation = z.enum(["support_via_qvapay"]);

export const ClaimSchema = z.object({
  owner: z.string(),
  certified: z.boolean(),
  value_1972: z.string(),
  current_holder: z.string(),
  title_iii: z.string(),
});
export type Claim = z.infer<typeof ClaimSchema>;

export const OpportunitySchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    sector: z.string().min(1),
    type: z.string(),
    lat: z.number().gte(-90).lte(90),
    lng: z.number().gte(-180).lte(180),
    province: z.string(),
    scale: z.string().optional().default(""),
    status: z.string().optional().default(""),
    ownership: Ownership,
    layer: Layer,
    investable_us: z.boolean(), // retained for audit; MUST be false (no equity lane)
    participation: Participation.optional(),
    helms_burton_overhang: z.boolean().optional().default(false),
    priority_recovery: z.boolean().optional().default(false),
    footnote: z.string().optional().default(""),
    sources: z.array(z.string()).default([]),
    notes: z.string().optional().default(""),
    confiscated: z.boolean().optional().default(false),
    claim: ClaimSchema.optional(),
  })
  // HARD RULE (§0/§10): there is NO equity-investment lane. No asset may be
  // marked investable_us=true — U.S. participation is remittance/payment support only.
  .refine((o) => o.investable_us === false, {
    message:
      "COMPLIANCE VIOLATION: investable_us must be false — U.S. participation is via QvaPay remittances/payments, not equity.",
    path: ["investable_us"],
  })
  // Support is permitted only on licensed private-sector ('opportunity') entries.
  .refine((o) => !(o.participation === "support_via_qvapay" && !(o.ownership === "private" && o.layer === "opportunity")), {
    message:
      "COMPLIANCE VIOLATION: participation=support_via_qvapay requires ownership='private' AND layer='opportunity'.",
    path: ["participation"],
  })
  .refine((o) => !(o.confiscated === true && !o.claim), {
    message: "A confiscated asset must carry a claim object.",
    path: ["claim"],
  });

export type Opportunity = z.infer<typeof OpportunitySchema>;
export const OpportunitiesSchema = z.array(OpportunitySchema);

/* ── Official compliance corpus ─────────────────────────────────────────────── */

export const SourceRef = z.object({ name: z.string(), url: z.string().optional() });

export const CrlEntity = z.object({
  name: z.string(),
  aka: z.array(z.string()).optional(),
  parent: z.string().nullable().optional(),
  also_sdn: z.boolean().optional(),
  sdn_note: z.string().optional(),
});
export const CrlSchema = z.object({
  list: z.string(),
  authority: z.string(),
  retrieved: z.string(),
  sources: z.array(SourceRef),
  notes: z.string().optional(),
  categories: z.array(z.object({ category: z.string(), entities: z.array(CrlEntity) })),
});
export type Crl = z.infer<typeof CrlSchema>;

export const SdnSchema = z.object({
  retrieved: z.string(),
  sources: z.array(SourceRef),
  authorities: z.array(z.object({ cite: z.string(), what: z.string() })),
  general_licenses_enabling_private_sector: z.array(
    z.object({ cite: z.string(), authorizes: z.string(), relevance: z.string().optional() })
  ),
  sdn_entries: z.array(
    z.object({
      name: z.string(),
      program: z.string().optional(),
      type: z.string().optional(),
      note: z.string().optional(),
      date_designated: z.string().optional(),
    })
  ),
  key_dates: z.array(z.object({ date: z.string(), event: z.string() })),
  notes: z.string().optional(),
});
export type Sdn = z.infer<typeof SdnSchema>;

export const CpalSchema = z.object({
  list: z.string(),
  authority: z.string(),
  retrieved: z.string(),
  sources: z.array(SourceRef),
  description: z.string(),
  properties: z.array(
    z.object({ name: z.string(), city: z.string().optional(), operator: z.string().optional(), note: z.string().optional() })
  ),
  notes: z.string().optional(),
});
export type Cpal = z.infer<typeof CpalSchema>;

export const EntitiesSchema = z.object({
  registry: z.string(),
  description: z.string(),
  retrieved: z.string(),
  entities: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      aka: z.array(z.string()).default([]),
      type: z.string(),
      role: z.string(),
      match: z.array(z.string()).default([]),
      controls: z.array(z.string()).default([]),
      sources: z.array(SourceRef).default([]),
    })
  ),
});
export type EntitiesFile = z.infer<typeof EntitiesSchema>;
export type ControllingEntity = EntitiesFile["entities"][number];

/* The macro file is display-only context; keep its schema permissive. */
export const MacroSchema = z.object({ country: z.string(), retrieved: z.string() }).passthrough();
export type Macro = z.infer<typeof MacroSchema>;

/* ── Reform Watch — curated digest cards (§0: NO article body field exists) ─── */
export const ReformCardSchema = z.object({
  id: z.string(),
  source: z.string(),
  publisher: z.string(),
  authors: z.array(z.string()).min(1), // attribution is mandatory
  date: z.string(),
  edition: z.number().optional(),
  title: z.string(),
  synopsis: z.string(), // our words, 2-3 sentences — never the article body
  key_stat: z.string().optional().default(""),
  map_tags: z.array(z.string()).default([]),
  why_matters: z.string().optional().default(""),
  url: z.string(),
  url_status: z.string().optional().default("ok"),
  curated_by: z.string().optional().default(""),
});
export const ReformCardsSchema = z.array(ReformCardSchema);
export type ReformCard = z.infer<typeof ReformCardSchema>;

/* ── Ecosystem directory ────────────────────────────────────────────────────── */
export const EcosystemCategory = z.enum(["on-island", "diaspora", "research"]);
export const EcosystemEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  category: EcosystemCategory,
  type: z.string(),
  blurb: z.string(),
  location: z.string().optional().default(""),
  url: z.string().optional(),
  tags: z.array(z.string()).default([]),
  venture: z.string().optional(),
  watchlist: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false),
});
export const EcosystemSchema = z.array(EcosystemEntrySchema);
export type EcosystemEntry = z.infer<typeof EcosystemEntrySchema>;
