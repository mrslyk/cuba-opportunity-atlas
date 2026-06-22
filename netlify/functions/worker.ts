/* Netlify Scheduled Function wrapper (schedule set in netlify.toml → @daily).
   Live when ANTHROPIC_API_KEY is set; DRY-RUN otherwise. Never auto-publishes
   and never flips an asset to Layer-1 — proposals go to the /admin review queue.

   Note: a web-search-backed refresh can exceed Netlify's synchronous function
   timeout; for heavier runs use a background function or the local `npm run worker`. */

import { runRefresh } from "../../scripts/worker-core";

export default async () => {
  const result = await runRefresh();
  console.log(`[netlify worker] ${result.mode} · ${result.note}`);
  return new Response(JSON.stringify(result), {
    headers: { "content-type": "application/json" },
  });
};
