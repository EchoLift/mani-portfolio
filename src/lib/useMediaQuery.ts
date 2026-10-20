"use client";

import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string, defaultValue = false): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") {
        return () => {};
      }
      const mq = window.matchMedia(query);
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => {
      if (typeof window === "undefined") {
        return defaultValue;
      }
      return window.matchMedia(query).matches;
    },
    () => defaultValue
  );
}
