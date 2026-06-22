import { describe, it, expect } from "vitest";
import { enriched, supportable, confiscated } from "./data";
import { canSupport, titleIIILevel } from "./compliance";

/* The 6 licensed private-sector entries U.S. persons may SUPPORT via QvaPay
   (OFAC-authorized remittances/payments — NOT equity). This list is the contract.
   If a data change adds/removes a Support button, this test must change with it —
   deliberately, never accidentally. */
const EXPECTED_SUPPORTABLE = [
  "coffee-sierra-maestra",
  "tourism-old-havana",
  "tourism-trinidad",
  "private-havana-mipymes",
  "private-pinar-farms",
  "private-emprende-graduates",
].sort();

describe("compliance engine — the hard rule (§0/§10)", () => {
  it("exposes Support for EXACTLY the six private-sector entries", () => {
    expect(supportable.map((o) => o.id).sort()).toEqual(EXPECTED_SUPPORTABLE);
  });

  it("never marks any asset investable_us=true (no equity lane)", () => {
    for (const o of enriched) expect(o.investable_us).toBe(false);
  });

  it("never exposes Support on a state or JV asset", () => {
    for (const o of enriched) {
      if (o.ownership === "state" || o.ownership === "jv") {
        expect(o.supportable).toBe(false);
      }
    }
  });

  it("never exposes Support on an atlas-layer asset", () => {
    for (const o of enriched) {
      if (o.layer === "atlas") expect(o.supportable).toBe(false);
    }
  });

  it("blocks Support when the controlling counterparty is sanctioned", () => {
    for (const o of enriched) {
      if (o.flags.crl || o.flags.sdn || o.flags.cpal) {
        expect(canSupport(o, o.flags)).toBe(false);
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
    expect(enriched.find((x) => x.id === "claim-havana-docks")!.titleIII).toBe("active");
  });
  it("classifies Exxon/Belot as active risk", () => {
    expect(enriched.find((x) => x.id === "claim-exxon-belot")!.titleIII).toBe("active");
  });
  it("treats 'none active' claims as no live Title III risk", () => {
    expect(titleIIILevel({ owner: "x", certified: true, value_1972: "", current_holder: "", title_iii: "none active" })).toBe("none");
  });
  it("the helms_burton_overhang flag aligns with the confiscated set", () => {
    const overhang = enriched.filter((o) => o.overhang).map((o) => o.id).sort();
    const confiscatedIds = confiscated.map((o) => o.id).sort();
    expect(overhang).toEqual(confiscatedIds);
  });
});
