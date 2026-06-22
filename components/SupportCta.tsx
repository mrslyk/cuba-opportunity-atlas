import Link from "next/link";

/* The ONLY place a "Support" affordance is rendered. It is given the already-
   computed `supportable` decision from the compliance engine — it never decides
   on its own. U.S. participation is OFAC-authorized remittance/payment support
   via QvaPay — NOT equity investment. */
export function SupportCta({
  supportable,
  assetName,
  footnote,
}: {
  supportable: boolean;
  assetName: string;
  footnote?: string;
}) {
  if (!supportable) return null;
  const qvapay = "https://qvapay.com";
  return (
    <div className="card border-invest/40 bg-invest/5 p-4">
      <div className="badge legal-invest mb-2">✅ Supportable via QvaPay</div>
      <p className="text-sm text-fog">
        Back <span className="text-text">{assetName}</span> the compliant way: OFAC-authorized
        remittances and payments routed through QvaPay wallets (QUSD) directly to licensed private
        entrepreneurs. <strong className="text-text">No equity, no state counterparty</strong> —
        settlement never touches GAESA, FINCIMEX, or a Cuban state bank.
      </p>
      {footnote && <p className="mt-2 text-[11px] text-ghost">{footnote}</p>}
      <div className="mt-3 flex gap-2">
        <Link href="/invest" className="btn btn-primary flex-1">Support via QvaPay →</Link>
        <a href={qvapay} target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-3">QvaPay</a>
      </div>
      <p className="mt-2 text-[11px] text-ghost">
        Recipients are KYC&apos;d and OFAC-SDN screened as independent private entities (≤100
        employees). No card or bank credentials are handled by this site.
      </p>
    </div>
  );
}
