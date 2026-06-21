import { NextResponse } from "next/server";

/* Layer-2 interest capture. NO PAYMENTS — stores a non-binding indication only.
   In production Netlify Forms captures the same submission; this endpoint makes
   local dev work and could be pointed at a DB/email later. */
export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }
  // Never accept anything that looks like payment data.
  for (const k of Object.keys(body)) {
    if (/card|cvv|iban|account|routing|ssn/i.test(k)) {
      return NextResponse.json({ ok: false, error: "payment fields not accepted" }, { status: 422 });
    }
  }
  // eslint-disable-next-line no-console
  console.log("[interest]", { asset: body.asset_id, email: body.email, type: body.capital_type });
  return NextResponse.json({ ok: true, message: "Non-binding interest registered." });
}
