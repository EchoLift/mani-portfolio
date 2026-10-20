export const fallbackPoster = "/images/neutral-frame.svg";

export function validPlaybackId(id?: string): id is string {
  return Boolean(id && /^[a-zA-Z0-9]{8,200}$/.test(id));
}

export function muxPoster(id?: string, time = 8) {
  if (!validPlaybackId(id)) return fallbackPoster;
  const query = new URLSearchParams({ width: "1600", time: String(time), fit_mode: "preserve" });
  return `https://image.mux.com/${encodeURIComponent(id)}/thumbnail.jpg?${query}`;
}

export function safePoster(value?: string) {
  if (!value) return undefined;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "image.mux.com" && !url.username && !url.password ? url.href : undefined;
  } catch {
    return undefined;
  }
}
