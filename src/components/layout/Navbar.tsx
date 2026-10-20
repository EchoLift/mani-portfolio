"use client";

import Link from "next/link";
import { siteConfig } from "@/data/site-config";
import { Arrow } from "../ui/Arrow";

export function Navbar() {
  return (
    <header className="site-header">
      <div className="container nav-inner flex items-center justify-between">
        <Link
          href="/"
          className="wordmark shrink min-w-0"
          aria-label={`${siteConfig.editorName} — home`}
        >
          <span className="wordmark-symbol shrink-0" aria-hidden="true">
            [MV]
          </span>
          <span className="min-w-0 truncate">
            <span className="block font-semibold tracking-wider truncate">{siteConfig.editorName}</span>
            <small className="block text-[8px] text-[#96938e] tracking-widest uppercase">VIDEO EDITOR & COLORIST</small>
          </span>
        </Link>

        {/* Editorial Status & Direct Contact Link */}
        <div className="flex items-center gap-3 shrink-0">
          {/* <div className="hidden md:flex items-center gap-2 text-[10px] text-[#96938e] uppercase tracking-[0.18em] px-3 py-1 rounded-full border border-white/10 bg-white/[0.02]">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#c6ae83]"
              aria-hidden="true"
            />
            <span>Available for select films · 2026</span>
          </div> */}

          {siteConfig.socials.instagram && (
          <a
            href={siteConfig.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-white/20 text-[#f3f0e9] hover:border-[#c6ae83] hover:text-[#c6ae83] transition-colors duration-200"
            aria-label={`Visit ${siteConfig.editorName} Instagram`}
          >
            <span>Instagram</span>
            <Arrow diagonal className="w-2.5 h-2.5" />
          </a>
          )}
        </div>
      </div>
    </header>
  );
}
