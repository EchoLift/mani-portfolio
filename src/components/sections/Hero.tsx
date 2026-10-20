"use client";

import dynamic from "next/dynamic";
import { siteConfig } from "@/data/site-config";
import { heroAssets } from "@/data/hero-assets";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { BlurText } from "../ui/BlurText";
import { Arrow } from "../ui/Arrow";

interface GridMotionProps {
  items?: (string | React.ReactNode | { src: string; alt?: string; focus?: string })[];
  rows?: number;
  columns?: number;
  aspectRatio?: number;
  gap?: number;
  radius?: number;
  angle?: number;
  tilt?: number;
  speed?: number;
  direction?: "alternate" | "left" | "right";
  parallax?: number;
  spotlight?: number;
  dim?: number;
  grayscale?: boolean;
  fade?: number;
  tileColor?: string;
  textColor?: string;
  theme?: "dark" | "light";
  className?: string;
  style?: React.CSSProperties;
}

// Dynamically import GridMotion to ensure safe client-side animation and prevent hydration mismatch
const GridMotion = dynamic<GridMotionProps>(
  () =>
    import("../ui/GridMotion") as unknown as Promise<
      React.ComponentType<GridMotionProps>
    >,
  {
    ssr: false,
    loading: () => null,
  }
);

export function Hero() {
  const isMobile = useMediaQuery("(max-width: 640px)", false);
  const gridSettings = {
    rows: isMobile ? 3 : 2,
    aspectRatio: isMobile ? 0.75 : 0.62,
    gap: isMobile ? 10 : 18,
    radius: 2,
    angle: isMobile ? -3 : -4,
    speed: 8,
    parallax: isMobile ? 0.04 : 0.1,
    dim: isMobile ? 0.55 : 0.5,
    fade: 0.4,
  };

  return (
    <section className="hero" aria-labelledby="hero-title">
      {/* Background: Decorative GridMotion collage using local assets */}
      <div className="hero-bg" aria-hidden="true">
        <GridMotion
          items={heroAssets}
          rows={gridSettings.rows}
          aspectRatio={gridSettings.aspectRatio}
          gap={gridSettings.gap}
          radius={gridSettings.radius}
          angle={gridSettings.angle}
          tilt={0}
          speed={gridSettings.speed}
          direction="alternate"
          parallax={gridSettings.parallax}
          spotlight={0.5}
          dim={gridSettings.dim}
          fade={gridSettings.fade}
          grayscale={false}
          theme="dark"
        />
      </div>

      {/* Cinematic dark atmospheric gradient overlay for text legibility */}
      <div className="hero-overlay" aria-hidden="true" />

      {/* Unified Foreground Content */}
      <div className="hero-content container">
        {/* Top: Restrained brand identifier */}
        <p className="hero-eyebrow label">
          <span className="tiny-line" aria-hidden="true" />
          <span>
            {siteConfig.editorName.toUpperCase()} · {siteConfig.title.toUpperCase()}
          </span>
        </p>

        {/* Center: Integrated Statement & Main Headline */}
        <div className="hero-headline-group">
          <h1 id="hero-title" className="hero-title">
            <BlurText text={siteConfig.hero.headline[0]} />
            <BlurText text={siteConfig.hero.headline[1]} delay={0.12} />
          </h1>

          <p className="hero-descriptor label">{siteConfig.hero.descriptor}</p>
          <div className="hero-actions-row">
            <a href="#work" className="hero-primary-cta">
              <span>{siteConfig.hero.ctaPrimary ?? "Explore 9 Selected Films"}</span>
              <Arrow diagonal className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

          {/* <div className="hero-footer hidden md:flex">
            <a className="scroll-cue label" href="#work">
              <span aria-hidden="true">↓</span>SCROLL TO EXPLORE
            </a>
            <p className="hero-intro">{siteConfig.hero.introduction}</p>
          </div> */}
      </div>
    </section>
  );
}
