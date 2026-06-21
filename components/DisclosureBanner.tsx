/* Global compliance disclosure (§6/§10) — required on /invest and every
   opportunity page. Two variants: a strong bar and an inline note. */

export function DisclosureBanner({ variant = "bar" }: { variant?: "bar" | "inline" }) {
  const text = (
    <>
      <strong className="text-text">Not investment advice.</strong> U.S. sanctions restrict Cuba
      investment to the licensed independent private sector. Every transaction is KYC&apos;d,
      OFAC-SDN &amp; Cuba Restricted List screened, confirmed as an independent private entity
      (≤100 employees), and subject to OFAC counsel. No money flows to state, JV, GAESA,
      Restricted-List or confiscated-property counterparties.
    </>
  );
  if (variant === "inline") {
    return <p className="rounded-md border border-[var(--line)] bg-[var(--panel)] p-3 text-xs text-fog">{text}</p>;
  }
  return (
    <div className="border-y border-risk/30 bg-risk/10">
      <div className="container-x py-2.5 text-xs text-fog">
        <span className="mr-2 font-mono text-risk">⚠ COMPLIANCE</span>
        {text}
      </div>
    </div>
  );
}
