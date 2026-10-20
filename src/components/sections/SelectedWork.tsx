import { siteConfig } from "@/data/site-config";
import { publishedProjects } from "@/data/projects";
import { UnifiedProjectCarousel } from "../portfolio/UnifiedProjectCarousel";
import { Reveal } from "../ui/Reveal";

export function SelectedWork() {
  return (
    <section
      id="work"
      className="section selected-work"
      aria-labelledby="work-title"
    >
      <div className="container">
        <div className="work-header">
          <div className="section-kicker label">
            <span>01 / THE WORK</span>
            <span>
              SELECTED WORK ({String(publishedProjects.length).padStart(2, "0")} FILMS)
            </span>
          </div>

          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <h2 id="work-title" className="work-heading">
                {siteConfig.work.title}
              </h2>
              <p className="text-[#96938e] max-w-md text-sm leading-relaxed">
                Nine vertical films shaped by considered rhythm, color, and narrative pacing. Select any film to view.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Unified 3D FlexCarousel & ReflectiveCard Showcase */}
        {publishedProjects.length > 0 ? (
          <Reveal className="w-full">
            <UnifiedProjectCarousel projects={publishedProjects} />
          </Reveal>
        ) : (
          <p className="muted">
            Selected films are being prepared. Come back for a closer look.
          </p>
        )}

        <div className="section-bottom label mt-16 pt-8 border-t border-white/10 flex justify-between text-[#96938e]">
          <span>STORY FIRST. ALWAYS.</span>
          <span>EDIT / COLOR / FINISH</span>
        </div>
      </div>
    </section>
  );
}
