import { describe, it, expect } from "vitest";
import { enriched, investable } from "./data";
import { canInvest, titleIIILevel } from "./compliance";

/* The 6 Layer-1 entries that are legally investable by U.S. persons today.
   This list is the contract. If a data change adds/removes an Invest button,
   this test must change with it — deliberately, never accidentally. */
const EXPECTED_INVESTABLE = [
  "coffee-sierra-maestra",
  "tourism-old-havana",
  "tourism-trinidad",
  "private-havana-mipymes",
  "private-pinar-farms",
  "private-emprende-graduates",
].sort();

describe("compliance engine — the hard rule (§0/§10)", () => {
  it("exposes Invest for EXACTLY the six private-sector Layer-1 entries", () => {
    expect(investable.map((o) => o.id).sort()).toEqual(EXPECTED_INVESTABLE);
  });

  it("never exposes Invest on a state or JV asset", () => {
    for (const o of enriched) {
      if (o.ownership === "state" || o.ownership === "jv") {
        expect(o.investable).toBe(false);
      }
    }
  });

  it("never exposes Invest on an atlas-layer asset", () => {
    for (const o of enriched) {
      if (o.layer === "atlas") expect(o.investable).toBe(false);
    }
  });

  it("blocks Invest when the controlling counterparty is sanctioned", () => {
    for (const o of enriched) {
      if (o.flags.crl || o.flags.sdn || o.flags.cpal) {
        expect(canInvest(o, o.flags)).toBe(false);
      }
    }
  });

  it("flags the Moa assets as SDN (EO 14404 cross-reference)", () => {
    for (const id of ["mining-moa-nickel", "port-moa"]) {
      const o = enriched.find((x) => x.id === id)!;
      expect(o.flags.sdn).toBe(true);
    }
  });
});

describe("Helms-Burton / Title III classification", () => {
  it("classifies Havana Docks as active risk", () => {
    const o = enriched.find((x) => x.id === "claim-havana-docks")!;
    expect(o.titleIII).toBe("active");
  });
  it("classifies Exxon/Belot as active risk", () => {
    const o = enriched.find((x) => x.id === "claim-exxon-belot")!;
    expect(o.titleIII).toBe("active");
  });
  it("treats 'none active' claims as no live Title III risk", () => {
    expect(titleIIILevel({ owner: "x", certified: true, value_1972: "", current_holder: "", title_iii: "none active" })).toBe("none");
  });
});
