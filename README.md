# Cuba Opportunity Atlas

The map-first intelligence atlas of Cuba's economy. Every major asset, who controls it, what
needs to be built, who it was confiscated from in 1960 — and the licensed private-sector slice
that is **legally investable today**. Built so the U.S.-sanctions compliance line is enforced in
code, not just copy.

> Independent research and product design — **not legal advice**. Stand up the fund and any
> Cuba-facing transaction only with OFAC sanctions counsel and securities counsel.

## The two layers (hard compliance model — §0/§10)

| | Layer 1 — Invest now | Layer 2 — Atlas |
|---|---|---|
| What | Licensed private-sector MIPYMEs | The full state economy (ports, energy, water, rail, industry) |
| Legal | ✅ Compliant today (OFAC GLs) | ℹ️ Information only |
| Money | AngelList SPV → QvaPay wallets | **None** — "register interest" |

An **Invest** affordance is rendered **only** when `canInvest()` returns true — i.e. the asset is
`private` + `layer:invest` + `investable_us:true` **and** its controlling counterparty clears the
Cuba Restricted List, the OFAC SDN list, and the Prohibited Accommodations List. A build-time
invariant (`lib/data.ts`) throws if any "investable" asset has a sanctioned counterparty, so a
data error cannot ship an illegal Invest button.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind
- **MapLibre GL** + **keyless Esri World Imagery** satellite tiles (zoom into real sites — no API key, no billing). Drop `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env` to swap providers later.
- **zod** schema validation of the whole data corpus at build time
- **Netlify** host: `@netlify/plugin-nextjs`, **Netlify Forms** (interest capture, no payments), **Netlify Scheduled Functions** (the agentic worker)

## Data corpus (`/data`)

| File | Contents | Source |
|---|---|---|
| `opportunities.json` | 60 mapped assets (+ Helms-Burton `claim` objects) | Research appendix |
| `cuba_restricted_list.json` | Cuba Restricted List entities | State Dept · Federal Register |
| `cuba_sdn.json` | OFAC SDN designations + authorities + general licenses | OFAC · EO 14404 |
| `cpal.json` | Prohibited Accommodations List hotels | State Dept · Federal Register |
| `cuba_macro.json` | Macro context | CIA World Factbook |
| `entities.json` | Controlling-entity registry (sanctions flags auto-computed) | Curated |

All files are dated snapshots (`retrieved`). Lists change — operational screening must use the
**live** OFAC/State sources. The worker re-pulls them; nothing auto-publishes to Layer-1.

## Develop

```bash
npm install
cp .env.example .env.local   # optional — no secrets required to run
npm run dev                  # http://localhost:3000
npm test                     # compliance engine tests (pins the investable set)
npm run worker               # agentic worker (DRY-RUN without ANTHROPIC_API_KEY)
npm run build                # also runs the compliance invariant guard
```

## Pages

`/` · `/map` · `/opportunity/[id]` · `/claims` (led by the May 21 2026 *Havana Docks* SCOTUS
ruling) · `/entities` + `/entities/[id]` · `/invest` · `/sectors` · `/compliance` · `/data` ·
`/about` · `/admin` (mock auth-gated agent-update review).

## Deploy (Netlify)

1. Push the repo; connect it in Netlify (build is auto-detected from `netlify.toml`).
2. Launches on `*.netlify.app`; attach a custom domain later with no rebuild.
3. Optional env: `NEXT_PUBLIC_ANGELLIST_FUND_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`,
   `ANTHROPIC_API_KEY` (worker live mode), `ADMIN_PASSPHRASE`.

Interest submissions appear in the Netlify **Forms** dashboard.

## Agentic update loop (publish path)

A **GitHub Action** (`.github/workflows/atlas-agent.yml`) runs daily, drafts data updates
(asset `status` refreshes + dead-link pruning — never ids/ownership/layer/participation/
investable_us), and **opens a Pull Request**. CI (`ci.yml`) runs the compliance tests + build
on the PR; you **merge to publish** (Netlify auto-deploys on merge to `main`). Nothing
auto-publishes — the PR diff is the human review gate.

**One-time GitHub setup:** add `ANTHROPIC_API_KEY` under **Settings → Secrets and variables →
Actions**, and enable **Settings → Actions → General → "Allow GitHub Actions to create and
approve pull requests."** Trigger a run anytime from the **Actions** tab (`workflow_dispatch`).
The Netlify scheduled worker is disabled in favor of this loop.
