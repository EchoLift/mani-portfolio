import type { MetadataRoute } from "next";
import { publishedProjects } from "@/data/projects";
import { siteConfig } from "@/data/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.url) return [];
  return [{ url: siteConfig.url, changeFrequency: "monthly", priority: 1 }, ...publishedProjects.map((project) => ({ url: `${siteConfig.url}/work/${project.slug}`, changeFrequency: "monthly" as const, priority: 0.8 }))];
}
