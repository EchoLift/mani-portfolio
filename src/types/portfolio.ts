// ─── Project ─────────────────────────────────────────────────────────────────

export type Project = {
  slug: string;
  title: string;
  category: string;
  year: number;
  role: string;
  description?: string;
  creativeApproach?: string;
  thumbnailUrl?: string;
  thumbnailAlt?: string;
  /** Mux playback ID for this project's video. */
  playbackId?: string;
  /** True when the video is shot in portrait / 9:16 orientation. */
  portrait?: boolean;
  featured: boolean;
  published: boolean;
  provisional?: boolean;
  additionalMedia?: { src: string; alt: string; caption?: string }[];
};

// ─── data.json schema ────────────────────────────────────────────────────────

/** Shape of a single project entry in data.json. */
export type DataProject = {
  slug: string;
  title: string;
  category: string;
  year: number;
  role: string;
  description?: string;
  muxPlaybackId: string;
  portrait: boolean;
  featured: boolean;
  published: boolean;
  order: number;
  thumbnailUrl?: string;
  thumbnailAlt?: string;
  provisional?: boolean;
};

export type DataService = {
  id: string;
  title: string;
  description: string;
  detail: string;
};

export type PortfolioData = {
  editor: {
    name: string;
    brand: string;
    monogram: string;
    role: string;
    email: string;
    phone: string;
    instagram: string;
  };
  seo: {
    title: string;
    description: string;
  };
  hero: {
    headline: [string, string];
    descriptor: string;
    introduction: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  work: {
    title: string;
    introduction: string;
  };
  about: {
    heading: string;
    philosophy: string;
    biography: string | null;
    location: string | null;
    tools: string[];
    image: string;
    imageAlt: string;
    imageCaption: string | null;
  };
  contact: {
    heading: string;
    introduction: string;
  };
  services: DataService[];
  projects: DataProject[];
};

// ─── SiteConfig ──────────────────────────────────────────────────────────────

export type SiteConfig = {
  editorName: string;
  identityIsPlaceholder: boolean;
  title: string;
  description: string;
  url?: string;
  email?: string;
  phone?: string;
  socials: { instagram?: string; linkedin?: string };
  hero: {
    headline: [string, string];
    descriptor: string;
    introduction: string;
    ctaPrimary?: string;
    ctaSecondary?: string;
  };
  work: { title: string; introduction: string };
  about: {
    heading: string;
    philosophy: string;
    biography?: string;
    location?: string;
    tools?: string[];
    image?: string;
    imageAlt?: string;
    imageCaption?: string;
  };
  contact: { heading: string; introduction: string };
  showreel?: { playbackId: string; title: string; poster?: string; portrait?: boolean };
};
