import { createOgImage } from "@/lib/og";
import { siteConfig } from "@/data/site-config";
export const alt = "Video editing, color grading, and visual storytelling";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return createOgImage(siteConfig.hero.headline.join("\n"), "A considered perspective.");
}
