import { NextResponse } from "next/server";

/* Contact capture. In production Netlify Forms captures the same submission and
   emails it to parsa@qvapay.com (configured as a form notification). This
   endpoint makes local dev work and could be pointed at a DB/email later.
   NO payments, no sensitive identifiers. */
export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }
  // Never accept anything that looks like payment or sensitive ID data.
  for (const k of Object.keys(body)) {
    if (/card|cvv|iban|account|routing|ssn|passport/i.test(k)) {
      return NextResponse.json({ ok: false, error: "sensitive fields not accepted" }, { status: 422 });
    }
  }
  // eslint-disable-next-line no-console
  console.log("[contact]", { email: body.email, topic: body.topic, name: body.name });
  return NextResponse.json({ ok: true, message: "Message received." });
}
