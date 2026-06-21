"use client";

import { useState } from "react";

/* Mock auth-gated admin review screen (§8 step 8). v1 reviews queued agent
   updates against local mock data; nothing auto-publishes to Layer-1 — a human
   approves each change here. Real auth + write-back wires in later. */

type Change = {
  id: string;
  asset: string;
  field: string;
  from: string;
  to: string;
  kind: "status" | "screening" | "new";
  flip?: boolean; // would flip to investable — requires explicit approval
};

const MOCK_QUEUE: Change[] = [
  { id: "c1", asset: "mining-moa-nickel", field: "screening", from: "JV — atlas", to: "🚫 SDN (EO 14404)", kind: "screening" },
  { id: "c2", asset: "cte-guiteras", field: "status", from: "9th breakdown by May", to: "Overhaul underway; 330MW partial", kind: "status" },
  { id: "c3", asset: "private-trinidad-paladar-x", field: "new", from: "—", to: "New vetted MIPYME deal (≤100 emp)", kind: "new", flip: true },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [queue, setQueue] = useState(MOCK_QUEUE);
  const [log, setLog] = useState<string[]>([]);

  function act(c: Change, action: "approve" | "reject") {
    setQueue((q) => q.filter((x) => x.id !== c.id));
    setLog((l) => [`${action === "approve" ? "✅ Approved" : "✗ Rejected"} ${c.asset} · ${c.field}${c.flip ? " (Layer-1 flip)" : ""}`, ...l]);
  }

  if (!authed) {
    return (
      <div className="container-x grid min-h-[60vh] place-items-center">
        <form
          onSubmit={(e) => { e.preventDefault(); setAuthed(pass.length > 0); }}
          className="card w-full max-w-sm space-y-3 p-6"
        >
          <div className="kicker">Admin · review queue</div>
          <h1 className="text-lg font-semibold text-text">Agent update review</h1>
          <p className="text-xs text-fog">Mock gate (v1). Real auth wires in later. Enter any passphrase to preview.</p>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Passphrase"
            className="w-full rounded bg-[var(--panel-2)] px-3 py-2 text-sm text-text"
          />
          <button className="btn btn-primary w-full">Enter</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container-x py-8">
      <div className="kicker mb-2">Admin · human-in-the-loop</div>
      <h1 className="text-2xl font-bold">Agent update review queue</h1>
      <p className="mt-2 text-sm text-fog">
        Proposed changes from the agentic worker. <strong className="text-text">Nothing publishes
        to Layer-1 without explicit approval here.</strong> Layer-1 flips are flagged.
      </p>

      <div className="mt-6 space-y-3">
        {queue.length === 0 && <p className="text-sm text-ghost">Queue empty — all changes actioned.</p>}
        {queue.map((c) => (
          <div key={c.id} className={`card p-4 ${c.flip ? "border-invest/40" : ""}`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-mono text-xs text-ghost">{c.asset}</div>
                <div className="mt-1 text-sm text-text">
                  <span className="kicker mr-2">{c.field}</span>
                  <span className="text-ghost line-through">{c.from}</span> → <span className="text-text">{c.to}</span>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => act(c, "approve")} className="btn btn-primary px-3 py-1.5 text-xs">Approve</button>
                <button onClick={() => act(c, "reject")} className="btn btn-ghost px-3 py-1.5 text-xs">Reject</button>
              </div>
            </div>
            {c.flip && <div className="mt-2 badge legal-invest">⚠️ Would flip to Investable — Layer-1</div>}
          </div>
        ))}
      </div>

      {log.length > 0 && (
        <div className="mt-8">
          <div className="kicker mb-2">Action log</div>
          <ul className="space-y-1 font-mono text-xs text-fog">{log.map((l, i) => <li key={i}>{l}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
