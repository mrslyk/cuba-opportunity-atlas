"use client";

import { useState } from "react";

/* Layer-2 "Register interest" — NON-BINDING indication only. No payments.
   Wired for Netlify Forms (data-netlify) with a graceful JS fallback. */
export function InterestForm({ assetId, assetName }: { assetId: string; assetName: string }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as any).toString(),
      }).catch(() => {});
      // Always also hit our own endpoint so dev works without Netlify.
      await fetch("/api/interest", { method: "POST", body: JSON.stringify(Object.fromEntries(data)), headers: { "Content-Type": "application/json" } });
      setDone(true);
    } catch {
      setError("Something went wrong — please email parsa@qvapay.com directly.");
    }
  }

  if (done) {
    return (
      <div className="card border-atlas/40 bg-atlas/5 p-4 text-sm text-fog">
        ✅ Interest registered for <span className="text-text">{assetName}</span>. This is a
        non-binding indication for the pipeline — <strong className="text-text">no money has moved
        and none can</strong> for this asset under U.S. sanctions.
      </div>
    );
  }

  return (
    <form
      name="register-interest"
      method="POST"
      data-netlify="true"
      onSubmit={onSubmit}
      className="card space-y-3 p-4"
    >
      <input type="hidden" name="form-name" value="register-interest" />
      <input type="hidden" name="asset_id" value={assetId} />
      <input type="hidden" name="asset_name" value={assetName} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field name="name" label="Name" required />
        <Field name="email" label="Email" type="email" required />
        <Field name="organization" label="Organization" />
        <div>
          <label className="mb-1 block text-xs text-fog">Capital type</label>
          <select name="capital_type" className="w-full rounded bg-[var(--panel-2)] px-2 py-2 text-sm text-text">
            <option value="non-us">Non-U.S. capital</option>
            <option value="us-post-sanctions">U.S. — post-sanctions only</option>
            <option value="research">Research / informational</option>
          </select>
        </div>
      </div>
      <textarea name="note" rows={2} placeholder="Optional note" className="w-full rounded bg-[var(--panel-2)] px-2 py-2 text-sm text-text placeholder:text-ghost" />
      <p className="text-[11px] text-ghost">
        Non-binding indication for the pipeline. This asset is information only — no U.S. participation
        today. No payment path is offered or implied.
      </p>
      {error && <p className="text-xs text-state">{error}</p>}
      <button type="submit" className="btn btn-atlas w-full">Register interest</button>
    </form>
  );
}

function Field({ name, label, type = "text", required }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-xs text-fog">{label}{required && " *"}</label>
      <input name={name} type={type} required={required} className="w-full rounded bg-[var(--panel-2)] px-2 py-2 text-sm text-text" />
    </div>
  );
}
