"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useMediaQuery } from "@/lib/useMediaQuery";
import type { Project } from "@/types/portfolio";
import { muxPoster, validPlaybackId } from "@/lib/media";
import { ReflectiveProjectCard } from "./ReflectiveProjectCard";
import { VideoDialog } from "../media/VideoDialog";
import { Arrow, Play } from "../ui/Arrow";

interface FlexCarouselItem {
  src: string;
  alt: string;
  title: string;
  subtitle?: string;
  slug?: string;
  project?: Project;
  index?: number;
}

interface FlexCarouselEngine {
  goTo?: (index: number) => void;
  step?: (direction: number) => void;
  openFocus?: (index: number) => void;
  closeFocus?: () => void;
}

interface FlexCarouselProps {
  items?: FlexCarouselItem[];
  carouselRef?: React.RefObject<FlexCarouselEngine | null>;
  preset?: string;
  intro?: string;
  cardHeight?: number;
  gap?: number;
  radius?: number;
  fit?: string;
  squeeze?: number;
  focusOnClick?: boolean;
  captions?: boolean;
  lensWidth?: number;
  lensHeight?: number;
  tilt?: number;
  roundness?: number;
  bend?: number;
  reach?: number;
  curl?: string;
  dispersion?: number;
  liquid?: number;
  followCursor?: boolean;
  autoplay?: boolean;
  interval?: number;
  captureWheel?: boolean;
  onChange?: (index: number, item?: FlexCarouselItem) => void;
  onSelect?: (index: number, item?: FlexCarouselItem) => void;
  renderCard?: (item?: FlexCarouselItem, index?: number) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// Dynamically import FlexCarousel with ssr: false for client-only WebGL initialization
const FlexCarousel = dynamic<FlexCarouselProps>(
  () =>
    import("../ui/FlexCarousel/FlexCarousel") as unknown as Promise<
      React.ComponentType<FlexCarouselProps>
    >,
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[340px] sm:h-[480px] lg:h-[580px] flex items-center justify-center bg-[#121212]/40 rounded-2xl border border-white/10 animate-pulse text-xs text-[#96938e] tracking-widest uppercase">
        Loading curated films…
      </div>
    ),
  }
);

interface UnifiedProjectCarouselProps {
  projects: Project[];
}

export function UnifiedProjectCarousel({ projects }: UnifiedProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedVideoProject, setSelectedVideoProject] = useState<Project | null>(null);
  const [autoStartVideo, setAutoStartVideo] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)", false);
  const carouselEngineRef = useRef<FlexCarouselEngine | null>(null);

  const activeProject = projects[activeIndex] || projects[0];

  // Map the 9 unique projects to FlexCarousel items
  const carouselItems = useMemo(() => projects.map((project, index) => ({
    src: project.thumbnailUrl ?? muxPoster(project.playbackId),
    alt: project.thumbnailAlt ?? `${project.title} film poster`,
    title: project.title,
    subtitle: `${project.category} · ${project.role}`,
    slug: project.slug,
    project,
    index,
  })), [projects]);

  const handleIndexChange = useCallback((newIndex: number) => {
    setActiveIndex(newIndex);
  }, []);

  const handleSelect = useCallback(
    (selectedIndex: number, item?: FlexCarouselItem) => {
      setActiveIndex(selectedIndex);
      const targetProject = projects[selectedIndex] || item?.project;
      if (targetProject && validPlaybackId(targetProject.playbackId)) {
        setAutoStartVideo(true);
        setSelectedVideoProject(targetProject);
      }
    },
    [projects]
  );

  const handleOpenVideo = useCallback(
    (proj?: Project) => {
      const target = proj || activeProject;
      if (target && validPlaybackId(target.playbackId)) {
        setAutoStartVideo(true);
        setSelectedVideoProject(target);
      }
    },
    [activeProject]
  );

  const handleNext = () => {
    carouselEngineRef.current?.step?.(1);
  };

  const handlePrev = () => {
    carouselEngineRef.current?.step?.(-1);
  };

  const handleGoTo = (index: number) => {
    carouselEngineRef.current?.goTo?.(index);
    setActiveIndex(index);
  };

  if (!activeProject) return null;

  return (
    <div className="unified-project-showcase w-full space-y-12">
      {/* 3D Liquid FlexCarousel Viewport */}
      <div className="relative w-full rounded-2xl border border-white/10 bg-[#0f0f0f]/90 overflow-hidden shadow-2xl shadow-black/80">
        {/* Top Header Strip inside carousel frame */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 text-[10px] font-mono tracking-widest text-[#96938e]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c6ae83] animate-pulse" />
            <span className="text-[#f3f0e9]">PORTFOLIO ARCHIVE</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden md:inline">SELECT FILM TO VIEW</span>
            <span className="text-[#c6ae83] font-semibold">
              FILM {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* The WebGL FlexCarousel Canvas Container */}
        <div className="relative w-full h-[340px] sm:h-[480px] lg:h-[580px]">
          <FlexCarousel
            items={carouselItems}
            carouselRef={carouselEngineRef}
            preset="liquid"
            intro="rise"
            cardHeight={isMobile ? 0.50 : 0.65}
            gap={isMobile ? 24 : 18}
            squeeze={isMobile ? 0.28 : 0.18}
            fit="portrait"
            focusOnClick={false}
            captions={false}
            lensWidth={isMobile ? 0.62 : 0.74}
            lensHeight={isMobile ? 0.95 : 1.18}
            tilt={isMobile ? 22 : 55}
            roundness={1}
            bend={isMobile ? 0.16 : 0.32}
            reach={isMobile ? 0.26 : 0.36}
            curl="twist"
            dispersion={isMobile ? 0.18 : 0.42}
            liquid={0}
            followCursor={false}
            autoplay={false}
            captureWheel={false}
            onChange={handleIndexChange}
            onSelect={handleSelect}
            className="w-full h-full"
          />
        </div>

        {/* Active Reel Interactive Bar (directly below canvas, eliminates floating caption collisions) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-white/10 bg-[#0d0d0d]/95">
          <div className="flex items-center gap-3 min-w-0">
            <span className="shrink-0 text-[9px] font-mono tracking-widest text-[#c6ae83] px-2 py-0.5 rounded bg-white/5 border border-white/10">
              FILM {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <div className="truncate">
              <p className="text-sm sm:text-base font-medium text-[#f3f0e9] truncate">
                {activeProject.title}
              </p>
              <p className="text-[10px] text-[#96938e] tracking-wider truncate">
                {activeProject.category} · {activeProject.role} · 9:16 Portrait
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {validPlaybackId(activeProject.playbackId) && (
              <button
                type="button"
                onClick={() => handleOpenVideo(activeProject)}
                className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider py-1.5 px-3.5 rounded-full bg-[#c6ae83] text-[#0b0b0b] hover:bg-white transition-colors duration-200"
              >
                <span className="w-3.5 h-3.5 flex items-center justify-center">
                  <Play />
                </span>
                <span>Watch Film</span>
              </button>
            )}
            <Link
              href={`/work/${activeProject.slug}`}
              className="inline-flex items-center gap-1.5 text-xs text-[#96938e] hover:text-[#c6ae83] transition-colors py-1.5 px-2"
            >
              <span>Notes</span>
              <Arrow diagonal className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-white/10 bg-[#0a0a0a]">
          {/* Mobile Stepper Controls (visible on mobile only) */}
          <div className="flex sm:hidden items-center justify-between w-full">
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#f3f0e9] py-1.5 px-3 rounded-lg border border-white/10 active:bg-white/10"
              aria-label="Previous film"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Prev</span>
            </button>

            <div className="flex flex-col items-center gap-1">
              <span className="text-[11px] font-mono text-[#c6ae83] font-semibold tracking-wider">
                {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-1">
                {projects.map((project, idx) => (
                  <span
                    key={project.slug}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      activeIndex === idx ? "w-4 bg-[#c6ae83]" : "w-1 bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#f3f0e9] py-1.5 px-3 rounded-lg border border-white/10 active:bg-white/10"
              aria-label="Next film"
            >
              <span>Next</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Desktop Tactile 9-Project Film Selector (hidden on mobile) */}
          <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
            {projects.map((p, idx) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => handleGoTo(idx)}
                className={`text-[10px] font-mono px-2.5 py-1 rounded transition-all duration-200 ${
                  activeIndex === idx
                    ? "bg-[#c6ae83] text-[#0b0b0b] font-semibold scale-105"
                    : "text-[#96938e] hover:text-[#f3f0e9] hover:bg-white/5"
                }`}
                aria-label={`Go to ${p.title}`}
                aria-current={activeIndex === idx ? "true" : undefined}
              >
                {String(idx + 1).padStart(2, "0")}
              </button>
            ))}
          </div>

          {/* Desktop Stepper Arrows */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2 rounded-full border border-white/10 text-[#f3f0e9] hover:border-[#c6ae83] hover:text-[#c6ae83] transition-colors"
              aria-label="Previous film"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-xs font-mono text-[#c6ae83] px-2">
              {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={handleNext}
              className="p-2 rounded-full border border-white/10 text-[#f3f0e9] hover:border-[#c6ae83] hover:text-[#c6ae83] transition-colors"
              aria-label="Next film"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Active Film Reflective Master Presentation */}
      <div className="hidden active-film-spotlight border border-white/10 rounded-2xl bg-[#121212]/60 p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Rich Editorial Metadata and Stream Trigger */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#c6ae83]" />
              <span className="label text-[#c6ae83] text-[9px] tracking-[0.2em]">
                ACTIVE SELECTION / FILM {String(activeIndex + 1).padStart(2, "0")}
              </span>
            </div>

            <h3
              className="text-3xl sm:text-4xl md:text-5xl text-[#f3f0e9] font-normal tracking-tight leading-[1.1]"
              style={{
                fontFamily:
                  'var(--font-display), -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro", sans-serif',
              }}
            >
              {activeProject.title}
            </h3>

            <p className="text-sm text-[#96938e] leading-relaxed max-w-lg">
              {activeProject.description ??
                "A vertical cinema edit crafted for narrative rhythm, light, and emotional tone."}
            </p>

            <dl className="grid grid-cols-3 gap-4 border-y border-white/10 py-5 my-6 text-xs">
              <div>
                <dt className="label text-[#96938e] text-[8px] mb-1">Category</dt>
                <dd className="text-[#f3f0e9] font-medium">{activeProject.category}</dd>
              </div>
              <div>
                <dt className="label text-[#96938e] text-[8px] mb-1">Role</dt>
                <dd className="text-[#f3f0e9] font-medium">{activeProject.role}</dd>
              </div>
              <div>
                <dt className="label text-[#96938e] text-[8px] mb-1">Format</dt>
                <dd className="text-[#c6ae83] font-medium">9:16 Portrait</dd>
              </div>
            </dl>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {validPlaybackId(activeProject.playbackId) && (
                <button
                  type="button"
                  onClick={() => handleOpenVideo(activeProject)}
                  className="film-button inline-flex items-center gap-3 text-xs uppercase tracking-wider py-2 px-5 rounded-full bg-[#c6ae83] text-[#0b0b0b] font-medium hover:bg-white transition-colors duration-200"
                >
                  <span className="w-4 h-4 flex items-center justify-center">
                    <Play />
                  </span>
                  <span>Watch {activeProject.title}</span>
                </button>
              )}

              <Link
                href={`/work/${activeProject.slug}`}
                className="text-link text-xs inline-flex items-center gap-2"
              >
                <span>View Project Page & Credits</span>
                <Arrow diagonal className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Reusable ReflectiveProjectCard with 3D Specular Reflection */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-[320px] sm:max-w-[360px]">
              <ReflectiveProjectCard
                key={activeProject.slug}
                slug={activeProject.slug}
                title={activeProject.title}
                category={activeProject.category}
                poster={activeProject.thumbnailUrl}
                playbackId={activeProject.playbackId}
                year={activeProject.year}
                index={activeIndex}
                featured={true}
                alt={activeProject.thumbnailAlt}
                onPlay={() => handleOpenVideo(activeProject)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Global Dedicated 9:16 Portrait Video Modal Player */}
      {selectedVideoProject && validPlaybackId(selectedVideoProject.playbackId) && (
        <VideoDialog
          isOpen={true}
          onOpenChange={(open) => {
            if (!open) {
              setAutoStartVideo(false);
              setSelectedVideoProject(null);
            }
          }}
          showTrigger={false}
          autoStart={autoStartVideo}
          playbackId={selectedVideoProject.playbackId}
          title={selectedVideoProject.title}
          poster={selectedVideoProject.thumbnailUrl}
          portrait={true}
        />
      )}
    </div>
  );
}
