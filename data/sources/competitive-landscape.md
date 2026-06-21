# Competitive Landscape & Source Mapping
*Reference for /about, /data, and positioning copy. Compiled 2026-06-20.*

## 1. Does any site do this for a single country?
No site fuses all three layers (opportunity + controlling-entity + confiscation-risk) on one
map. Closest analogues, each covering only one layer:

- **Global Energy Monitor (GEM)** — https://globalenergymonitor.org/ — the closest *overall*:
  asset-level interactive maps + ownership chains traced up to the ultimate **government**
  parent + every datapoint sourced. Mirrors our Atlas + /entities pillars. Lacks deal flow
  and a claims/legal-risk layer.
- **ProCuba / MINCEX "Cartera de Oportunidades"** — Cuba's own official FDI portfolio. The
  closest *single-country genre* match, but state-authored, static PDF/list, no map, and it
  sells the state deals U.S. persons legally cannot touch. **Our site is its adversarial mirror.**
- **invest.gov** (US) — single-country interactive map of ~32,000 infrastructure projects /
  ~$470B. Closest in *form* (one country, map, sectors) but announcements, not deal flow/risk.
- **Global Infrastructure Outlook (G20/GIHub)** — https://outlook.gihub.org/ — models infra
  *needs & gaps to 2040* across 56 countries. Best analogue for the "what needs to be built"
  pillar (quantified buildout gap per sector), which we derive from each asset's `status`.
- **FT fDi Atlas / InvestmentMap** — https://www.ftlocations.com/products-and-services/investment-map
  — searchable cross-border investment by sector/region; the "Bloomberg deal terminal" cousin,
  but global and paywalled.

**Whitespace / positioning:** "Global Energy Monitor for all of Cuba, with an AngelList button
on the legal ~5% and a Helms-Burton risk overlay on the rest." The independent, compliance-aware,
claims-aware counter-version of a government IPA portal.

## 2. Authoritative source → where it lands in the product
| Source | What it adds | Lands in |
|---|---|---|
| State Dept **Cuba Restricted List** (§515.209) — `data/cuba_restricted_list.json` (236 entities) | Authoritative GAESA + sub-entity roster U.S. persons can't transact with | `/entities`, 🚫 flags, legal badges, compliance engine cross-ref |
| OFAC **SDN** + authorities + GLs §515.340/582/542/578, **EO 14404** (GAESA, 2026-05-07), June 5 wind-down — `data/cuba_sdn.json` | Legal basis for Layer-1 legality + screening obligation | `/compliance` (cited authorities), Invest-path screening note |
| State Dept **Prohibited Accommodations List** — `data/cpal.json` (429 hotels) | Hotels U.S. persons may not lodge at | `/entities`, tourism assets, CPAL flag |
| CIA **World Factbook — Cuba** — `data/cuba_macro.json` | Macro context (GDP, pop, sector split, trade, energy) | `/data` macro panel, `/sectors` context |

**Posture caveat (build into UI):** baked-in lists are dated *snapshots* (stamped `retrieved`,
with "as of" dates shown). They change — the CRL/SDN just expanded under EO 14404. Display +
educate from the snapshot; the agentic worker re-pulls the live list for actual screening. The
site states plainly that operational screening must use the live OFAC/State sources.

## 3. Live cross-reference finding (EO 14404, May 2026)
**Moa Nickel S.A.** and **Minera La Victoria S.A.** were placed on the **SDN list** under
EO 14404. This controls our assets `mining-moa-nickel` and `port-moa` → both must render a
🚫 **SDN** flag (an escalation the hand-written `notes` did not capture).
