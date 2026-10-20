import { siteConfig } from "@/data/site-config";
import { emailHref, phoneHref, socialHref } from "@/lib/config";
import { Arrow } from "../ui/Arrow";
import { Reveal } from "../ui/Reveal";

export function Contact() {
  const email = emailHref(siteConfig.email);
  const phone = phoneHref(siteConfig.phone);
  const socialLinks = (["instagram", "linkedin"] as const)
    .map((platform) => ({ platform, href: socialHref(siteConfig.socials[platform], platform) }))
    .filter((link) => link.href);

  return (
    <section id="contact" className="section contact-section" aria-labelledby="contact-title">
      <div className="container">
        <div className="section-kicker label">
          <span>04 / THE NEXT STORY</span>
          <span>LET&apos;S CREATE SOMETHING</span>
        </div>
        <Reveal>
          <div className="contact-editorial">
            <h2 id="contact-title">{siteConfig.contact.heading}</h2>
            <div className="contact-bottom">
              <p>{siteConfig.contact.introduction}</p>
              {email ? (
                <a className="contact-button" href={email}>
                  Let&apos;s talk <Arrow diagonal />
                </a>
              ) : (
                <div className="contact-pending">
                  <span className="contact-button is-disabled" aria-disabled="true">
                    Let&apos;s talk <Arrow diagonal />
                  </span>
                  <p>Inquiries open via Instagram{siteConfig.socials.instagram ? ` ${new URL(siteConfig.socials.instagram).pathname.replace(/\/$/, "").replace("/", "@")}` : ""}</p>
                </div>
              )}
            </div>
          </div>
        </Reveal>
        {(email || phone || socialLinks.length > 0) && (
          <div className="contact-links">
            {email && (
              <a href={email}>
                <span className="label muted">EMAIL</span>
                <span>{siteConfig.email}</span>
                <Arrow diagonal />
              </a>
            )}
            {phone && (
              <a href={phone}>
                <span className="label muted">PHONE</span>
                <span>{siteConfig.phone}</span>
                <Arrow diagonal />
              </a>
            )}
            {socialLinks.map(({ platform, href }) => (
              <a href={href} key={platform} target="_blank" rel="noopener noreferrer">
                <span className="label muted">{platform === "instagram" ? "SOCIAL" : platform}</span>
                <span>{platform === "instagram" ? "Instagram" : platform}</span>
                <Arrow diagonal />
              </a>
            ))}
          </div>
        )}
        {process.env.NODE_ENV === "development" && !email && (
          <p className="dev-notice">
            Setup: add your email and social profiles in src/data/site-config.ts to enable inquiries.
          </p>
        )}
      </div>
    </section>
  );
}
