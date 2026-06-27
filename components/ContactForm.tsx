"use client";

import { useState } from "react";

/* Contact / questions form. Wired for Netlify Forms (data-netlify) with a
   graceful JS fallback to /api/contact so local dev works without Netlify.
   Submissions route to parsa@qvapay.com via the Netlify Forms email
   notification configured on the "contact" form. No payments, no sensitive data. */
export function ContactForm() {
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
      // Also hit our own endpoint so dev works without Netlify.
      await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(data)),
        headers: { "Content-Type": "application/json" },
      });
      setDone(true);
    } catch {
      setError("Something went wrong — please email parsa@qvapay.com directly.");
    }
  }

  if (done) {
    return (
      <div className="card border-atlas/40 bg-atlas/5 p-5 text-sm text-fog">
        ✅ Thanks — your message is on its way to the team. We&apos;ll reply to the email you gave us.
      </div>
    );
  }

  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      onSubmit={onSubmit}
      className="card space-y-3 p-5"
    >
      <input type="hidden" name="form-name" value="contact" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field name="name" label="Name" required />
        <Field name="email" label="Email" type="email" required />
        <Field name="organization" label="Organization" />
        <div>
          <label className="mb-1 block text-xs text-fog">Topic</label>
          <select
            name="topic"
            className="w-full rounded bg-[var(--panel-2)] px-2 py-2 text-sm text-text"
          >
            <option value="general">General question</option>
            <option value="opportunity">An opportunity / asset</option>
            <option value="partnership">Partnership</option>
            <option value="press">Press / media</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs text-fog">Message *</label>
        <textarea
          name="message"
          rows={5}
          required
          placeholder="How can we help?"
          className="w-full rounded bg-[var(--panel-2)] px-2 py-2 text-sm text-text placeholder:text-ghost"
        />
      </div>
      <p className="text-[11px] text-ghost">
        Goes to the QvaPay team. We don&apos;t collect payment details here — never send card,
        bank, or ID numbers through this form.
      </p>
      {error && <p className="text-xs text-state">{error}</p>}
      <button type="submit" className="btn btn-primary w-full">
        Send message
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-fog">
        {label}
        {required && " *"}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded bg-[var(--panel-2)] px-2 py-2 text-sm text-text"
      />
    </div>
  );
}
