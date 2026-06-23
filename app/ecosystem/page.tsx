import type { Metadata } from "next";
import { ecosystem } from "@/lib/data";
import { EcosystemDirectory } from "@/components/EcosystemDirectory";

export const metadata: Metadata = {
  title: "Ecosystem — who's building for Cuba",
  description:
    "A running, link-first directory of the people and programs building Cuba's private economy — on-island accelerators, diaspora founders and nonprofits, and the research shops mapping the reform.",
};

export default function EcosystemPage() {
  return (
    <div className="container-x py-8">
      <div className="kicker mb-2">Who&apos;s building for Cuba</div>
      <h1 className="text-3xl font-bold tracking-tight">Ecosystem</h1>
      <p className="prose-cuba mt-3">
        The Atlas maps the assets; this is the directory of the <strong className="text-text">people
        and programs</strong> building toward them — on-island training and developer communities,
        diaspora founders and nonprofits, and the research shops charting the reform. Link-first and
        kept current; we prune dead links each update.
      </p>
      <div className="mt-6">
        <EcosystemDirectory entries={ecosystem} />
      </div>
    </div>
  );
}
