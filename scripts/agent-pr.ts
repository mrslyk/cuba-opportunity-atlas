/* ─────────────────────────────────────────────────────────────────────────────
   Atlas agent → Pull Request. Runs in GitHub Actions (daily). Calls the worker
   to research updates, APPLIES conservative edits to the data files (asset
   `status` refreshes + dead-link pruning only — never ids, ownership, layer,
   participation, or investable_us), and writes a PR body. The workflow opens a
   PR; CI runs the compliance tests + build on it; a human merges to publish.

   Safe by construction: the only auto-edited fields are free-text status and
   outbound links. The build-time invariant + tests gate every PR, so a bad edit
   fails CI and cannot be merged green.
   ──────────────────────────────────────────────────────────────────────────── */

import fs from "node:fs";
import path from "node:path";
import { runRefresh } from "./worker-core";

const DATA = path.resolve(process.cwd(), "data");
const BODY_PATH = process.env.PR_BODY_PATH || "/tmp/agent-pr-body.md";
const read = (f: string) => JSON.parse(fs.readFileSync(path.join(DATA, f), "utf8"));

/* Serialize to match the repo's existing JSON style: 2-space indent, objects
   multi-line, but arrays of primitives kept inline (e.g. ["a","b"]). This keeps
   the agent's PR diffs surgical — only the lines it actually changed move,
   instead of every array exploding onto multiple lines. */
function serialize(value: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  const padIn = "  ".repeat(indent + 1);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    if (value.every((v) => v === null || typeof v !== "object")) {
      return "[" + value.map((v) => JSON.stringify(v)).join(", ") + "]";
    }
    return "[\n" + value.map((v) => padIn + serialize(v, indent + 1)).join(",\n") + "\n" + pad + "]";
  }
  if (value && typeof value === "object") {
    const keys = Object.keys(value as Record<string, unknown>);
    if (keys.length === 0) return "{}";
    const body = keys
      .map((k) => padIn + JSON.stringify(k) + ": " + serialize((value as Record<string, unknown>)[k], indent + 1))
      .join(",\n");
    return "{\n" + body + "\n" + pad + "}";
  }
  return JSON.stringify(value);
}

const write = (f: string, d: unknown) =>
  fs.writeFileSync(path.join(DATA, f), serialize(d) + "\n");

async function main() {
  const result = await runRefresh();

  if (result.mode === "dry-run") {
    console.log("[agent-pr] DRY-RUN (no ANTHROPIC_API_KEY) — nothing proposed.");
    fs.writeFileSync(BODY_PATH, "Dry-run: no ANTHROPIC_API_KEY configured; nothing proposed.\n");
    return;
  }

  let changed = 0;
  const applied: string[] = [];
  const pruned: string[] = [];

  // 1. Apply status refreshes (free-text only).
  const opps = read("opportunities.json") as Record<string, unknown>[];
  const byId = new Map(opps.map((o) => [o.id as string, o]));
  for (const p of result.proposals) {
    if (p.field !== "status") continue;
    const o = byId.get(p.assetId);
    if (o && p.to && o.status !== p.to) {
      o.status = p.to;
      applied.push(`- **${p.assetId}** status → ${p.to}  _(${p.rationale})_`);
      changed++;
    }
  }
  if (applied.length) write("opportunities.json", opps);

  // 2. Prune dead outbound links (ecosystem url removed; reform link downgraded).
  const deadSet = new Set(result.deadLinks.map((d) => d.split(" ")[0]));
  if (deadSet.size) {
    const eco = read("ecosystem.json") as Record<string, unknown>[];
    let ecoChanged = false;
    for (const e of eco) {
      if (e.url && deadSet.has(e.url as string)) {
        pruned.push(`- ecosystem **${e.id}**: removed dead link ${e.url}`);
        delete e.url;
        ecoChanged = true;
        changed++;
      }
    }
    if (ecoChanged) write("ecosystem.json", eco);

    const reform = read("reform_cards.json") as Record<string, unknown>[];
    let reformChanged = false;
    for (const c of reform) {
      if (deadSet.has(c.url as string) && c.url_status === "ok") {
        c.url_status = "pending_canonical";
        pruned.push(`- reform **${c.id}**: link unreachable → marked pending`);
        reformChanged = true;
        changed++;
      }
    }
    if (reformChanged) write("reform_cards.json", reform);
  }

  const body = [
    "## Atlas agent — proposed data updates",
    "",
    result.note,
    "",
    applied.length ? `### Status refreshes (${applied.length})\n${applied.join("\n")}` : "_No status refreshes this run._",
    "",
    pruned.length ? `### Dead-link pruning (${pruned.length})\n${pruned.join("\n")}` : "_No dead links found._",
    "",
    "> Review the diff and **merge to publish**. CI runs the compliance tests + build on this PR; the agent only edits free-text `status` and outbound links — never ids, ownership, layer, participation, or investable_us.",
  ].join("\n");
  fs.writeFileSync(BODY_PATH, body + "\n");
  console.log(`[agent-pr] applied=${applied.length} pruned=${pruned.length} changed=${changed}`);
}

main().catch((e) => {
  console.error("[agent-pr] failed", e);
  process.exit(1);
});
