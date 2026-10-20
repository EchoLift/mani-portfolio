"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Play } from "../ui/Arrow";

const MuxVideo = dynamic(() => import("./MuxVideo").then((m) => m.MuxVideo), {
  loading: () => <div className="video-shell player-loading" role="status">Preparing film…</div>,
});

export function VideoDialog({
  playbackId,
  title,
  poster,
  portrait,
  label = "Watch featured film",
  isOpen,
  onOpenChange,
  showTrigger = true,
  autoStart = false,
}: {
  playbackId: string;
  title: string;
  poster?: string;
  /** Forward the portrait flag so the player uses aspect-ratio: 9 / 16. */
  portrait?: boolean;
  label?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
  autoStart?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = isOpen !== undefined;
  const isCurrentlyOpen = isControlled ? isOpen : internalOpen;

  useEffect(() => {
    const dialogEl = dialog.current;
    if (!dialogEl) return;
    if (isCurrentlyOpen) {
      if (!dialogEl.open) {
        dialogEl.showModal();
      }
    } else {
      if (dialogEl.open) {
        dialogEl.close();
      }
    }
  }, [isCurrentlyOpen]);

  useEffect(() => {
    if (!isCurrentlyOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isCurrentlyOpen]);

  const close = () => {
    if (isControlled) {
      onOpenChange?.(false);
    } else {
      dialog.current?.close();
    }
  };

  const handleOpen = () => {
    if (isControlled) {
      onOpenChange?.(true);
    } else {
      setInternalOpen(true);
      dialog.current?.showModal();
    }
  };

  const handleDialogClose = () => {
    if (isControlled) {
      onOpenChange?.(false);
    } else {
      setInternalOpen(false);
      trigger.current?.focus();
    }
  };

  return (
    <>
      {showTrigger && (
        <button
          ref={trigger}
          className="film-button"
          aria-haspopup="dialog"
          onClick={handleOpen}
        >
          <span className="round-play">
            <Play />
          </span>
          <span>{label}</span>
        </button>
      )}
      <dialog
        ref={dialog}
        className={`film-dialog${portrait ? " film-dialog--portrait" : ""}`}
        aria-labelledby="film-dialog-title"
        onClose={handleDialogClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="dialog-inner">
          <div className="dialog-heading">
            <h2 id="film-dialog-title">{title}</h2>
            <button className="close-button" onClick={close} aria-label="Close video">
              Close <span aria-hidden="true">×</span>
            </button>
          </div>
          {isCurrentlyOpen && (
            <MuxVideo
              playbackId={playbackId}
              title={title}
              poster={poster}
              portrait={portrait}
              autoStart={autoStart}
            />
          )}
          <p className="dialog-note">
            {autoStart
              ? "Playing with sound. Use the player controls for volume and playback."
              : "Press play to begin. Sound is never played automatically."}
          </p>
        </div>
      </dialog>
    </>
  );
}
