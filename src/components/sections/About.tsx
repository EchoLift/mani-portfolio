import { siteConfig } from "@/data/site-config";
import { VideoPoster } from "../media/VideoPoster";
import { Reveal } from "../ui/Reveal";
import { Arrow } from "../ui/Arrow";

export function About() {
  const { about } = siteConfig;
  return (
    <section id="about" className="section container about-section" aria-labelledby="about-title">
      <div className="section-kicker label">
        <span>03 / THE PERSPECTIVE</span>
        <span>BEHIND THE EDIT</span>
      </div>
      <div className="about-grid">
        <Reveal className="about-visual">
          <figure>
            <div className="about-image">
              <VideoPoster
                src={about.image}
                alt={about.imageAlt ?? "An editorial image"}
                sizes="(max-width: 900px) 100vw, 55vw"
              />
              <span className="image-corner label">LIGHT / RHYTHM / EMOTION</span>
            </div>
            {about.imageCaption && <figcaption>{about.imageCaption}</figcaption>}
          </figure>
        </Reveal>
        <Reveal className="about-copy">
          <span className="label accent">A CONSIDERED PERSPECTIVE</span>
          <h2 id="about-title">{about.heading}</h2>
          <p className="about-philosophy">{about.philosophy}</p>
          {about.biography ? (
            <p className="muted">{about.biography}</p>
          ) : (
            <p className="text-sm text-[#96938e] leading-relaxed">
              Collaborating with directors, creators, and brands to shape visual narratives that connect and endure.
            </p>
          )}
          {(about.location || Boolean(about.tools?.length)) && (
            <p className="label muted">
              {[about.location, about.tools?.join(" / ")].filter(Boolean).join(" · ")}
            </p>
          )}
          <a className="text-link" href="#contact">
            Let’s make something meaningful <Arrow diagonal />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
