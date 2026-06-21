/* Netlify Scheduled Function wrapper (schedule set in netlify.toml → @daily).
   Keeps the DRY-RUN, never-auto-publish posture of scripts/worker.ts. */

export default async () => {
  const live = !!process.env.ANTHROPIC_API_KEY;
  console.log(`[netlify worker] tick · mode=${live ? "LIVE" : "DRY-RUN"} · ${new Date().toISOString()}`);
  // TODO(live): re-pull CRL/SDN, diff vs snapshots, enqueue changes for /admin.
  // Layer-1 flips are NEVER auto-published — human approval required.
  return new Response(JSON.stringify({ ok: true, mode: live ? "live" : "dry-run" }), {
    headers: { "content-type": "application/json" },
  });
};
