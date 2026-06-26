/* ─────────────────────────────────────────────────────────────────────────────
   Agentic refresh — shared core (§5). Live when ANTHROPIC_API_KEY is set,
   otherwise DRY-RUN. It NEVER auto-publishes and NEVER flips an asset to
   Layer-1: it writes proposals to data/worker-queue.json for a human to approve
   in /admin. Uses the Anthropic SDK (claude-opus-4-8) with the web_search server
   tool to pull current Cuban sector/sanctions news.

   NOTE: the live path is implemented per the Anthropic SDK reference but is only
   exercised once a real ANTHROPIC_API_KEY is provided.
   ──────────────────────────────────────────────────────────────────────────── */

import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";

export type Proposal = {
  assetId: string;
  field: "status" | "sources" | "screening";
  from: string;
  to: string;
  rationale: string;
  wouldFlipLayer1: boolean; // hard rule: never auto-applied
};

export type RefreshResult = {
  mode: "live" | "dry-run";
  proposals: Proposal[];
  deadLinks: string[]; // ecosystem/reform URLs that failed a reachability check
  note: string;
};

/* §4.4 — audit Reform Watch + Ecosystem outbound links. Live only (needs network);
   returns URLs to prune. pending_canonical links are skipped (intentionally not live yet). */
async function auditDirectoryLinks(): Promise<string[]> {
  const dead: string[] = [];
  const urls = new Set<string>();
  try {
    const eco = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "ecosystem.json"), "utf8")) as { url?: string }[];
    for (const e of eco) if (e.url) urls.add(e.url);
    const reform = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "reform_cards.json"), "utf8")) as { url: string; url_status?: string }[];
    for (const c of reform) if (c.url_status !== "pending_canonical") urls.add(c.url);
  } catch {
    return dead;
  }
  for (const u of urls) {
    try {
      const r = await fetch(u, { method: "HEAD", redirect: "follow" });
      if (r.status >= 400) dead.push(`${u} (${r.status})`);
    } catch {
      dead.push(`${u} (unreachable)`);
    }
  }
  return dead;
}

const DATA_DIR = path.resolve(process.cwd(), "data");
const QUEUE_PATH = path.join(DATA_DIR, "worker-queue.json");
const MAX_ASSETS = 8; // bound cost/time per run

type Opp = { id: string; name: string; sector: string; status?: string; investable_us?: boolean };

const SCHEMA_HINT = `Return ONLY a fenced \`\`\`json block containing an array of objects:
[{ "assetId": string, "field": "status"|"sources", "to": string (<=260 chars, complete sentences — no trailing fragment), "rationale": string (<=200 chars) }]
Only include an asset if you found a concrete, sourced update worth reviewing. Never propose making an asset investable.`;

/* Trim to a length without cutting mid-word (no ellipsis added). */
function clamp(s: string, max: number): string {
  if (s.length <= max) return s.trim();
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd();
}

export async function runRefresh(opts: { dryRun?: boolean } = {}): Promise<RefreshResult> {
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  const stamp = new Date().toISOString();

  if (opts.dryRun || !hasKey) {
    return { mode: "dry-run", proposals: [], deadLinks: [], note: `No ANTHROPIC_API_KEY — DRY-RUN at ${stamp}. Nothing published.` };
  }

  const opps: Opp[] = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "opportunities.json"), "utf8"));
  // Prioritize distressed/atlas assets for a status refresh; never the investable ones.
  const subset = opps.filter((o) => !o.investable_us).slice(0, MAX_ASSETS);

  const client = new Anthropic(); // reads ANTHROPIC_API_KEY
  const prompt = `You maintain a Cuba investment atlas. For each asset below, search the web for any
material change since mid-2026 to its operational status, financing, or sources. Be conservative —
only propose an update when you find a concrete, citable change.

Assets:
${subset.map((o) => `- ${o.id} | ${o.name} (${o.sector}) | current status: ${o.status ?? "—"}`).join("\n")}

${SCHEMA_HINT}`;

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 8000,
    thinking: { type: "adaptive" },
    tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 8 }],
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const proposals = parseProposals(text, subset);
  // §4.4: also audit Reform Watch + Ecosystem outbound links for pruning.
  // (New reform/ecosystem entries are likewise drafted for human approval — never
  // auto-published — and would be appended to the queue here in a fuller build.)
  const deadLinks = await auditDirectoryLinks();
  fs.writeFileSync(QUEUE_PATH, JSON.stringify({ generated: stamp, proposals, deadLinks }, null, 2));

  return {
    mode: "live",
    proposals,
    deadLinks,
    note: `Live refresh at ${stamp}: ${proposals.length} proposal(s) + ${deadLinks.length} dead link(s) queued for human approval in /admin. Nothing published.`,
  };
}

function parseProposals(text: string, subset: Opp[]): Proposal[] {
  const known = new Map(subset.map((o) => [o.id, o]));
  const match = text.match(/```json\s*([\s\S]*?)```/);
  if (!match) return [];
  let raw: unknown;
  try {
    raw = JSON.parse(match[1]);
  } catch {
    return [];
  }
  if (!Array.isArray(raw)) return [];
  const out: Proposal[] = [];
  for (const item of raw) {
    const o = item && typeof item === "object" ? (item as Record<string, unknown>) : null;
    if (!o) continue;
    const asset = known.get(String(o.assetId));
    if (!asset) continue; // ignore hallucinated ids
    const field = o.field === "sources" ? "sources" : "status";
    out.push({
      assetId: asset.id,
      field,
      from: asset.status ?? "—",
      to: clamp(String(o.to ?? ""), 260),
      rationale: clamp(String(o.rationale ?? ""), 200),
      wouldFlipLayer1: false, // the worker can never propose a Layer-1 flip
    });
  }
  return out;
}
