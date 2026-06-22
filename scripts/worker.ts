/* Local entry point for the agentic refresh. Run: `npm run worker`.
   DRY-RUN unless ANTHROPIC_API_KEY is set. Never auto-publishes; never flips
   an asset to Layer-1 — proposals land in data/worker-queue.json for /admin. */

import { runRefresh } from "./worker-core";

async function main() {
  console.log(`[worker] starting · ${new Date().toISOString()}`);
  const result = await runRefresh();
  console.log(`[worker] mode=${result.mode}`);
  console.log(`[worker] ${result.note}`);
  for (const p of result.proposals) {
    console.log(`  • ${p.assetId} (${p.field}) → ${p.to}`);
  }
}

main().catch((e) => {
  console.error("[worker] failed", e);
  process.exit(1);
});
