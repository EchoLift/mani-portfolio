import type { SiteConfig } from "@/types/portfolio";
import { publicOrigin } from "@/lib/config";
import portfolioData from "./data.json";

const d = portfolioData;

export const siteConfig: SiteConfig = {
  editorName: d.editor.name,
  identityIsPlaceholder: false,
  title: d.seo.title,
  description: d.seo.description,
  url: publicOrigin(process.env.NEXT_PUBLIC_SITE_URL),
  email: d.editor.email || undefined,
  phone: d.editor.phone || undefined,
  socials: {
    instagram: d.editor.instagram || undefined,
    linkedin: undefined,
  },
  hero: {
    headline: d.hero.headline as [string, string],
    descriptor: d.hero.descriptor,
    introduction: d.hero.introduction,
    ctaPrimary: d.hero.ctaPrimary,
    ctaSecondary: d.hero.ctaSecondary,
  },
  work: {
    title: d.work.title,
    introduction: d.work.introduction,
  },
  about: {
    heading: d.about.heading,
    philosophy: d.about.philosophy,
    biography: d.about.biography ?? undefined,
    location: d.about.location ?? undefined,
    tools: d.about.tools.length ? d.about.tools : undefined,
    image: d.about.image || undefined,
    imageAlt: d.about.imageAlt || undefined,
    imageCaption: d.about.imageCaption ?? undefined,
  },
  contact: {
    heading: d.contact.heading,
    introduction: d.contact.introduction,
  },
};
