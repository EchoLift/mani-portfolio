import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, publishedProjects } from "@/data/projects";
import { siteConfig } from "@/data/site-config";
import { MuxVideo } from "@/components/media/MuxVideo";
import { VideoPoster } from "@/components/media/VideoPoster";
import { Contact } from "@/components/sections/Contact";
import { Arrow } from "@/components/ui/Arrow";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return publishedProjects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Film not found", robots: { index: false } };
  const description =
    project.description ??
    `${project.title} — ${project.category} edited by Mani Venkat (Mani FX).`;
  return {
    title: project.title,
    description,
    alternates: siteConfig.url ? { canonical: `/work/${project.slug}` } : undefined,
    openGraph: {
      title: project.title,
      description,
      type: "website",
      ...(siteConfig.url
        ? {
            url: `${siteConfig.url}/work/${project.slug}`,
            images: [{ url: `/work/${project.slug}/opengraph-image` }],
          }
        : {}),
    },
    twitter: { card: "summary_large_image", title: project.title, description },
  };
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const index = publishedProjects.findIndex((item) => item.slug === slug);
  const previous = index > 0 ? publishedProjects[index - 1] : undefined;
  const next = index < publishedProjects.length - 1 ? publishedProjects[index + 1] : undefined;

  return (
    <main id="main-content" className="project-page">
      <div className="container">
        <Link href="/#work" className="text-link back-link">
          <span aria-hidden="true">←</span>Selected work
        </Link>
        <div className="project-title-row">
          <div>
            <p className="label accent">SELECTED FILM / {String(index + 1).padStart(2, "0")}</p>
            <h1>{project.title}</h1>
          </div>
          <span className="label muted">{project.year}</span>
        </div>
        <dl className="project-metadata">
          <div><dt>Category</dt><dd>{project.category}</dd></div>
          <div><dt>Role</dt><dd>{project.role}</dd></div>
          <div><dt>Format</dt><dd>{project.portrait ? "9:16 Portrait" : "16:9"}</dd></div>
        </dl>
        {/* Portrait videos are wrapped in a centred column so they stay narrow. */}
        <div className={project.portrait ? "project-video-portrait" : undefined}>
          <MuxVideo
            playbackId={project.playbackId}
            title={project.title}
            poster={project.thumbnailUrl}
            portrait={project.portrait}
          />
        </div>
        {(project.description || project.creativeApproach) && (
          <div className="project-story">
            {project.description && (
              <section>
                <h2>The story</h2>
                <p>{project.description}</p>
              </section>
            )}
            {project.creativeApproach && (
              <section>
                <h2>The approach</h2>
                <p>{project.creativeApproach}</p>
              </section>
            )}
          </div>
        )}
        {project.additionalMedia?.map((media) => (
          <figure className="additional-media" key={media.src}>
            <div className="wide-frame">
              <VideoPoster src={media.src} alt={media.alt} />
            </div>
            {media.caption && <figcaption>{media.caption}</figcaption>}
          </figure>
        ))}
        <nav className="project-pagination" aria-label="More selected films">
          {previous ? (
            <Link href={`/work/${previous.slug}`}>
              <span className="label muted">PREVIOUS FILM</span>
              {previous.title}
            </Link>
          ) : (
            <Link href="/#work" className="text-link">Back to collection</Link>
          )}
          {next && (
            <Link href={`/work/${next.slug}`}>
              <span className="label muted">NEXT FILM</span>
              {next.title}
              <Arrow diagonal />
            </Link>
          )}
        </nav>
      </div>
      <Contact />
    </main>
  );
}
