"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { muxPoster, validPlaybackId } from "@/lib/media";
import { VideoPoster } from "../media/VideoPoster";
import { VideoDialog } from "../media/VideoDialog";
import { Arrow, Play } from "../ui/Arrow";

// Types for the dynamic ReflectiveCard component
interface ReflectiveCardProps {
  width?: number | string;
  height?: number | string;
  theme?: "dark" | "light";
  tint?: string;
  metalness?: number;
  roughness?: number;
  blurStrength?: number;
  shine?: number;
  glare?: number;
  grayscale?: number;
  warp?: number;
  warpScale?: number;
  bevel?: number;
  tiltStrength?: number;
  radius?: number;
  enableTilt?: boolean;
  intro?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// Dynamically import ReflectiveCard with ssr: false for safe client-only WebGL initialization
const ReflectiveCard = dynamic<ReflectiveCardProps>(
  () =>
    import("../ui/ReflectiveCard/ReflectiveCard") as unknown as Promise<
      React.ComponentType<ReflectiveCardProps>
    >,
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full h-full bg-[#121212] rounded-[18px] border border-white/10 animate-pulse"
        style={{ aspectRatio: "9 / 16" }}
      />
    ),
  }
);

export interface ReflectiveProjectCardProps {
  slug: string;
  title: string;
  category: string;
  poster?: string;
  playbackId?: string;
  year?: number;
  duration?: string;
  alt?: string;
  subtitle?: string;
  featured?: boolean;
  index?: number;
  priority?: boolean;
  onPlay?: () => void;
  className?: string;
  compact?: boolean;
}

export function ReflectiveProjectCard({
  slug,
  title,
  category,
  poster,
  playbackId,
  year = 2026,
  duration,
  alt,
  subtitle,
  featured = false,
  index = 0,
  priority = false,
  onPlay,
  className = "",
  compact = false,
}: ReflectiveProjectCardProps) {
  const isTouchOrMobile = useMediaQuery("(max-width: 640px), (hover: none)", false);

  const posterSrc = poster ?? muxPoster(playbackId);
  const formattedIndex = String(index + 1).padStart(2, "0");
  const hasValidVideo = validPlaybackId(playbackId);

  return (
    <article
      className={`reflective-project-card group relative w-full h-full flex flex-col items-center ${
        featured ? "featured-reflective-card" : ""
      } ${className}`.trim()}
    >
      <div
        className="relative w-full max-w-[360px] sm:max-w-[420px] rounded-[18px] overflow-hidden"
        style={{ aspectRatio: "9 / 16" }}
      >
        <ReflectiveCard
          width="100%"
          height="100%"
          theme="dark"
          tint="#ffffff"
          metalness={0.88}
          roughness={0.3}
          blurStrength={4}
          shine={0.8}
          glare={isTouchOrMobile ? 0.2 : 0.35}
          grayscale={1}
          warp={isTouchOrMobile ? 0.2 : 0.4}
          warpScale={1}
          bevel={2.2}
          tiltStrength={isTouchOrMobile ? 0 : (featured ? 7 : 5)}
          radius={18}
          enableTilt={!isTouchOrMobile}
          intro={true}
          className="w-full h-full"
          style={{ aspectRatio: "9 / 16" }}
        >
          {/* Poster image layer blending with metallic reflection underneath */}
          <div className="absolute inset-0 z-0 overflow-hidden rounded-[16px] pointer-events-none">
            <VideoPoster
              src={posterSrc}
              alt={alt ?? `${title} film poster`}
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 900px) 60vw, 420px"
              className="object-cover opacity-60 transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Cinematic gradient shade */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b]/95 via-[#0b0b0b]/25 to-[#0b0b0b]/40" />
          </div>

          {/* Centered Play Cue Button */}
          {hasValidVideo && (
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay?.();
                }}
                className="pointer-events-auto w-14 h-14 rounded-full bg-[#0b0b0b]/75 backdrop-blur-md border border-[#c6ae83]/60 flex items-center justify-center text-[#c6ae83] shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:border-[#c6ae83] group-hover:text-white"
                aria-label={`Play ${title}`}
              >
                <span className="w-5 h-5 flex items-center justify-center ml-0.5">
                  <Play />
                </span>
              </button>
            </div>
          )}

          {/* Editorial Content Overlay */}
          <div className="relative z-10 flex flex-col justify-between h-full p-5 sm:p-6 select-none pointer-events-auto">
            {/* Header: Project Index and Category */}
            <div className="flex items-center justify-between gap-2">
              <span className="label text-[#c6ae83] text-[9px] tracking-[0.2em] px-2.5 py-0.5 bg-[#0b0b0b]/70 rounded-full border border-white/10 backdrop-blur-md">
                FRAME / {formattedIndex}
              </span>
              <span className="label text-[#f3f0e9]/70 text-[8px] tracking-[0.16em]">
                {category}
              </span>
            </div>

            {/* Bottom Info: Title, Metadata, and Action Triggers */}
            <div className="mt-auto space-y-3 pt-6">
              <div>
                <p className="text-[10px] text-[#c6ae83] tracking-widest uppercase mb-1 font-medium">
                  {duration ? `${duration} · ` : ""}{year} · 9:16 PORTRAIT
                </p>
                <h3
                  className={`text-[#f3f0e9] font-normal tracking-tight leading-[1.15] ${
                    compact
                      ? "text-lg sm:text-xl"
                      : featured
                      ? "text-2xl sm:text-3xl md:text-4xl"
                      : "text-xl sm:text-2xl"
                  }`}
                  style={{
                    fontFamily:
                      'var(--font-display), -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro", sans-serif',
                  }}
                >
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs text-[#96938e] mt-1 line-clamp-2">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {hasValidVideo && (
                  onPlay ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlay();
                      }}
                      className="film-button inline-flex items-center gap-2 text-[10px] uppercase tracking-wider py-1.5 px-3.5 rounded-full bg-[#c6ae83] text-[#0b0b0b] font-medium hover:bg-white transition-colors duration-200"
                    >
                      <span className="w-3 h-3 flex items-center justify-center">
                        <Play />
                      </span>
                      <span>Watch Film</span>
                    </button>
                  ) : (
                    <VideoDialog
                      playbackId={playbackId}
                      title={title}
                      poster={poster}
                      portrait={true}
                      label="Watch Film"
                    />
                  )
                )}

                <Link
                  href={`/work/${slug}`}
                  className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-full bg-white/5 border border-white/15 text-[#f3f0e9] hover:border-[#c6ae83] hover:text-[#c6ae83] transition-colors duration-200"
                  aria-label={`View notes for ${title}`}
                >
                  <span>Film Notes</span>
                  <Arrow diagonal className="w-2.5 h-2.5" />
                </Link>
              </div>
            </div>
          </div>
        </ReflectiveCard>
      </div>
    </article>
  );
}
