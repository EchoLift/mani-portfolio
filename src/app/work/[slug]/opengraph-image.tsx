import { notFound } from "next/navigation";
import { getProject } from "@/data/projects";
import { createOgImage } from "@/lib/og";
export const alt = "Selected film";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return createOgImage(project.title, `${project.category} · ${project.year}`);
}
