import { muxPoster } from "@/lib/media";
import portfolioData from "./data.json";

const projectFrame = (slug: string, time: number, alt: string, focus: string) => {
  const project = portfolioData.projects.find((item) => item.slug === slug);
  if (!project) throw new Error(`Missing hero project: ${slug}`);
  return { src: muxPoster(project.muxPlaybackId, time), alt, focus };
};

export const heroAssets = [
  projectFrame("selected-work-02", 16, "Jewelry portrait in traditional attire", "50% 20%"),
  projectFrame("selected-work-02", 24, "Jewelry presentation in traditional attire", "50% 24%"),
  projectFrame("selected-work-03", 32, "Jewelry display in a warm workshop", "50% 50%"),
  projectFrame("selected-work-04", 38, "Interview portrait in a studio", "50% 20%"),
  projectFrame("selected-work-07", 8, "Artisan workshop interior", "50% 48%"),
  projectFrame("selected-work-07", 16, "Display of artisan products", "50% 40%"),
  projectFrame("selected-work-08", 24, "Filmmaker speaking on camera", "50% 22%"),
  { src: "/images/mani.png", alt: "Concert crowd beneath stage lights", focus: "50% 55%" },
];
