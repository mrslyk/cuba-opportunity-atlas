import type { MetadataRoute } from "next";
import { enriched, entities } from "@/lib/data";

const BASE = "https://cubanew.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/map", "/sectors", "/claims", "/entities", "/invest", "/legal", "/compliance", "/data", "/about"];
  const staticUrls = routes.map((r) => ({ url: `${BASE}${r}`, changeFrequency: "weekly" as const, priority: r === "" ? 1 : 0.7 }));
  const opps = enriched.map((o) => ({ url: `${BASE}/opportunity/${o.id}`, changeFrequency: "weekly" as const, priority: 0.6 }));
  const ents = entities.map((e) => ({ url: `${BASE}/entities/${e.id}`, changeFrequency: "monthly" as const, priority: 0.5 }));
  return [...staticUrls, ...opps, ...ents];
}
