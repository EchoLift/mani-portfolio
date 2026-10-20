import type { Project } from "../types/portfolio";

export function selectPublishedProjects(projects: readonly Project[]): Project[] {
  const slugs = new Set<string>();
  return projects.filter((project) => {
    if (!project.published || !project.title.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) return false;
    if (slugs.has(project.slug)) return false;
    slugs.add(project.slug);
    return true;
  });
}
