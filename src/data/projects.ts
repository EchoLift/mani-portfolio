import "server-only";
import type { Project, DataProject } from "@/types/portfolio";
import { selectPublishedProjects } from "@/lib/projects";
import portfolioData from "./data.json";

/** Map a data.json project entry to the internal Project type. */
function toProject(d: DataProject): Project {
  return {
    slug: d.slug,
    title: d.title,
    category: d.category,
    year: d.year,
    role: d.role,
    description: d.description,
    playbackId: d.muxPlaybackId,
    thumbnailUrl: d.thumbnailUrl,
    thumbnailAlt: d.thumbnailAlt ?? `${d.title} portrait poster`,
    portrait: d.portrait,
    featured: d.featured,
    published: d.published,
    provisional: d.provisional,
  };
}

const projects: Project[] = [...portfolioData.projects]
  .sort((a, b) => a.order - b.order)
  .map(toProject);

export const publishedProjects = selectPublishedProjects(projects);
export const getProject = (slug: string) =>
  publishedProjects.find((p) => p.slug === slug);
export const featuredProject =
  publishedProjects.find((p) => p.featured) ?? publishedProjects[0];
