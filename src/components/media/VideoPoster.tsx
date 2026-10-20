"use client";

import Image from "next/image";
import { useState } from "react";
import { fallbackPoster, safePoster } from "@/lib/media";

export function VideoPoster({ src, alt, priority = false, sizes = "100vw", className = "" }: {
  src?: string; alt: string; priority?: boolean; sizes?: string; className?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const source = safePoster(src) ?? fallbackPoster;
  return <Image src={failedSrc === source ? fallbackPoster : source}
    alt={alt} fill sizes={sizes} preload={priority}
    className={`video-poster ${className}`} onError={() => setFailedSrc(source)} />;
}
