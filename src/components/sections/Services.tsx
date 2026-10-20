import { services } from "@/data/services";
import { Reveal } from "../ui/Reveal";

export function Services() {
  return (
    <section id="services" className="section services-section" aria-labelledby="services-title">
      <div className="container">
        <div className="section-kicker label">
          <span>02 / THE CRAFT</span>
          <span>CREATIVE CAPABILITIES</span>
        </div>
        <Reveal className="services-heading">
          <h2 id="services-title">
            The craft behind<br />the <em>feeling.</em>
          </h2>
          <p>
            From the first assembly to the final frame.<br />
            A focused approach to bringing stories to life.
          </p>
        </Reveal>
        <div className="services-list">
          {services.map((service, index) => (
            <Reveal key={service.title}>
              <article className="service-row">
                <span className="service-num" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="service-content">
                  <h3 className="service-title">{service.title}</h3>
                  <span className="service-detail label">{service.detail}</span>
                </div>
                <p className="service-desc">{service.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
