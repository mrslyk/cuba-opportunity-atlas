import Link from "next/link";

/* The ONLY place an Invest affordance is rendered. It is given the already-
   computed `investable` decision from the compliance engine — it never decides
   on its own. */
export function InvestCta({ investable, assetName }: { investable: boolean; assetName: string }) {
  if (!investable) return null;
  const fundUrl = process.env.NEXT_PUBLIC_ANGELLIST_FUND_URL;
  return (
    <div className="card border-invest/40 bg-invest/5 p-4">
      <div className="badge legal-invest mb-2">✅ Investable today</div>
      <p className="text-sm text-fog">
        Back <span className="text-text">{assetName}</span> through the AngelList SPV. Capital lands
        on the ground via QvaPay wallets (QUSD). Recipients are KYC&apos;d, OFAC-SDN screened, and
        confirmed as independent private entities (≤100 employees).
      </p>
      <div className="mt-3 flex gap-2">
        {fundUrl ? (
          <a href={fundUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex-1">
            Invest via AngelList →
          </a>
        ) : (
          <Link href="/invest" className="btn btn-primary flex-1">Invest — see the fund →</Link>
        )}
      </div>
      <p className="mt-2 text-[11px] text-ghost">
        Securities and accreditation handled at AngelList. No card or bank credentials are handled
        by this site.
      </p>
    </div>
  );
}
