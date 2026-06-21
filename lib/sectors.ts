/* Sector metadata: color (used on map markers + chips), label, short blurb. */
export type SectorMeta = { key: string; label: string; color: string; blurb: string };

export const SECTORS: Record<string, SectorMeta> = {
  ports: { key: "ports", label: "Ports", color: "#38bdf8", blurb: "Deepwater terminals, the Mariel gateway, cruise & bulk." },
  rail: { key: "rail", label: "Rail", color: "#a78bfa", blurb: "The only railroad in the Caribbean — near-total recapitalization needed." },
  transport: { key: "transport", label: "Transport", color: "#818cf8", blurb: "Airports and the unfinished national expressway." },
  energy: { key: "energy", label: "Energy", color: "#f59e0b", blurb: "A grid in crisis — thermo overhaul, the solar buildout, oil & wind." },
  water: { key: "water", label: "Water", color: "#22d3ee", blurb: "Leaking aqueducts, wastewater and tourism-zone desalination." },
  mining: { key: "mining", label: "Mining", color: "#f97316", blurb: "Nickel & cobalt — Holguín holds ~34% of world Ni reserves." },
  agriculture: { key: "agriculture", label: "Agriculture", color: "#84cc16", blurb: "Tobacco, sugar, coffee — terroir the world pays a premium for." },
  biotech: { key: "biotech", label: "Biotech", color: "#2dd4bf", blurb: "Globally respected vaccines and monoclonals; export-grade IP." },
  tourism: { key: "tourism", label: "Tourism", color: "#f472b6", blurb: "Heritage cities and the dollarized cays; private hospitality." },
  "private-sector": { key: "private-sector", label: "Private sector", color: "#22c55e", blurb: "Licensed MIPYMEs — the only lane investable today." },
  telecom: { key: "telecom", label: "Telecom", color: "#60a5fa", blurb: "Confiscated phone system; a thin, state-controlled network." },
  manufacturing: { key: "manufacturing", label: "Manufacturing", color: "#fb7185", blurb: "Steel, cement, textiles, breweries — brownfield revivals." },
  retail: { key: "retail", label: "Retail", color: "#e879f9", blurb: "Confiscated department stores; GAESA-controlled chains today." },
  rum: { key: "rum", label: "Rum", color: "#fbbf24", blurb: "Bacardí's birthplace and the Havana Club trademark war." },
  cigars: { key: "cigars", label: "Cigars", color: "#d4a373", blurb: "Confiscated marques: Partagás, Montecristo, Romeo y Julieta." },
  "industry-zone": { key: "industry-zone", label: "Industrial zone", color: "#94a3b8", blurb: "The Mariel special development zone (GAESA land)." },
};

export function sectorMeta(key: string): SectorMeta {
  return (
    SECTORS[key] ?? { key, label: key, color: "#94a3b8", blurb: "" }
  );
}
