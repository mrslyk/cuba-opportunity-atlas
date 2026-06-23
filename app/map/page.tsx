import type { Metadata } from "next";
import { MapView } from "@/components/MapView";
import { mapPoints } from "@/lib/data";

export const metadata: Metadata = {
  title: "Interactive map",
  description: "The full-screen interactive atlas of Cuba's assets — filter by sector, ownership, and legal status, toggle the Helms-Burton / Rightful Owners overlay.",
};

export default function MapPage({ searchParams }: { searchParams: { sector?: string; recovery?: string } }) {
  const sector = typeof searchParams.sector === "string" ? searchParams.sector : "all";
  const recovery = searchParams.recovery === "1" || searchParams.recovery === "logistics";
  const logistics = searchParams.recovery === "logistics";
  return (
    <div className="container-x py-4">
      <div className="mb-3">
        <h1 className="text-xl font-semibold">Opportunity Atlas — interactive map</h1>
        <p className="text-sm text-fog">
          Satellite imagery (keyless Esri). Toggle layers, filter, and click any asset for its
          dossier. Green-ringed markers are supportable via QvaPay; orange glow = active Title III risk.
        </p>
      </div>
      <MapView points={mapPoints} initialSector={sector} initialRecovery={recovery} initialLogistics={logistics} />
    </div>
  );
}
