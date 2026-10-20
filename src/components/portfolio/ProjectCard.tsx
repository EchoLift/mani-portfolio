import Link from "next/link";
import type { Project } from "@/types/portfolio";
import { muxPoster, validPlaybackId } from "@/lib/media";
import { VideoPoster } from "../media/VideoPoster";
import { Arrow, Play } from "../ui/Arrow";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="ec-card">
      <Link href={`/work/${project.slug}`} className="ec-card-link" aria-label={`Explore ${project.title}`}>
        <div className="ec-frame">
          <VideoPoster
            src={project.thumbnailUrl ?? muxPoster(project.playbackId)}
            alt={project.thumbnailAlt ?? `${project.title} film poster`}
            sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"
          />
          <div className="ec-overlay">
            <div className="ec-meta">
              <p className="ec-number label">{String(index + 1).padStart(2, "0")}</p>
              <p className="ec-category label">{project.category}</p>
            </div>
            <div className="ec-bottom">
              <h3 className="ec-title">{project.title}</h3>
              <span className="ec-cta label">
                {validPlaybackId(project.playbackId) ? <Play /> : <Arrow diagonal />}
                <span>{validPlaybackId(project.playbackId) ? "Watch" : "View"}</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
