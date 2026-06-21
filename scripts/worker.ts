/* ─────────────────────────────────────────────────────────────────────────────
   Agentic update worker (§5). DRY-RUN by default — it NEVER auto-publishes and
   NEVER flips an asset to Layer-1. It produces a review queue a human approves in
   /admin. Wire the live Claude API + a real Restricted-List/SDN re-pull where
   marked. Run locally: `npm run worker`. In prod: Netlify Scheduled Function.
   ──────────────────────────────────────────────────────────────────────────── */

type ProposedChange = {
  asset: string;
  field: "status" | "scale" | "sources" | "screening";
  from: string;
  to: string;
  flip: boolean;
};

const DRY_RUN = !process.env.ANTHROPIC_API_KEY;

async function refreshScreening(): Promise<ProposedChange[]> {
  // TODO(live): re-pull the current Cuba Restricted List + OFAC SDN, diff against
  // data/cuba_restricted_list.json & data/cuba_sdn.json, and propose flag changes.
  // In DRY-RUN we emit nothing so the snapshot in the repo stays source of truth.
  return [];
}

async function refreshStatus(): Promise<ProposedChange[]> {
  // TODO(live): call the Claude API to summarize fresh Cuban/sector news per asset
  // (MINCEX/ProCuba, BNamericas, energy/port trackers) and propose status updates.
  return [];
}

async function main() {
  console.log(`[worker] starting · mode=${DRY_RUN ? "DRY-RUN (no API key)" : "LIVE"} · ${new Date().toISOString()}`);
  const changes = [...(await refreshScreening()), ...(await refreshStatus())];

  // HARD RULE: the worker may NEVER auto-publish a Layer-1 flip.
  const flips = changes.filter((c) => c.flip);
  if (flips.length) {
    console.log(`[worker] ${flips.length} change(s) would flip to Layer-1 — queued for HUMAN approval only.`);
  }

  console.log(`[worker] ${changes.length} proposed change(s) → review queue (/admin). Nothing published.`);
  // TODO(live): persist `changes` to the review store the admin screen reads.
}

main().catch((e) => {
  console.error("[worker] failed", e);
  process.exit(1);
});
