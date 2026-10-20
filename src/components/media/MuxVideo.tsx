"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { muxPoster, safePoster, validPlaybackId } from "@/lib/media";
import { VideoPoster } from "./VideoPoster";
import { Play } from "../ui/Arrow";

const Player = dynamic(() => import("@mux/mux-player-react"), {
  ssr: false,
  loading: () => <div className="player-loading" role="status">Loading film…</div>,
});

export function MuxVideo({
  playbackId,
  title,
  poster,
  portrait = false,
}: {
  playbackId?: string;
  title: string;
  poster?: string;
  /** Pass true for 9:16 portrait videos. The shell will use aspect-ratio: 9 / 16. */
  portrait?: boolean;
}) {
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const image = safePoster(poster) ?? muxPoster(playbackId);
  const aspectRatio = portrait ? "9 / 16" : "16 / 9";
  const shellClass = `video-shell${portrait ? " video-shell--portrait" : ""}`;

  if (!validPlaybackId(playbackId))
    return (
      <div className={shellClass} style={{ aspectRatio }}>
        <VideoPoster src={image} alt={`${title} poster`} />
        <p className="media-status">Film preview unavailable.</p>
      </div>
    );

  return (
    <div className={shellClass} style={{ aspectRatio }} aria-label={`${title} video`}>
      {!started ? (
        <button
          className="video-start"
          onClick={() => setStarted(true)}
          aria-label={`Load player for ${title}`}
        >
          <VideoPoster src={image} alt="" />
          <span className="video-start-label">
            <span className="round-play">
              <Play />
            </span>
            Watch film
          </span>
        </button>
      ) : failed ? (
        <div className="player-error" role="alert">
          <p>This film couldn&apos;t be loaded.</p>
          <p className="muted">Check your connection and try again.</p>
          <button
            className="text-link"
            onClick={() => {
              setAttempt((n) => n + 1);
              setFailed(false);
            }}
          >
            Retry playback <span aria-hidden="true">↗</span>
          </button>
        </div>
      ) : (
        <Player
          key={attempt}
          playbackId={playbackId}
          title={title}
          metadata={{ video_title: title }}
          poster={image}
          streamType="on-demand"
          preload="metadata"
          playsInline
          accentColor="#C6AE83"
          primaryColor="#F3F0E9"
          secondaryColor="#121212"
          onError={() => setFailed(true)}
          style={{ width: "100%", height: "100%", aspectRatio }}
        />
      )}
    </div>
  );
}
