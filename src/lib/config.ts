export function publicOrigin(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

export function emailHref(email?: string): string | undefined {
  const value = email?.trim();
  if (!value || !/^[^\s@?&#%]+@[^\s@?&#%]+\.[^\s@?&#%]+$/.test(value)) return undefined;
  return `mailto:${value}`;
}

/**
 * Returns a sanitised `tel:` href for the given phone string, or undefined
 * if the value is absent or contains non-phone characters.
 * Only digits, spaces, hyphens, plus, and parentheses are accepted.
 */
export function phoneHref(phone?: string): string | undefined {
  const value = phone?.trim();
  if (!value || !/^[+\d\s\-().]{7,20}$/.test(value)) return undefined;
  // Strip everything except digits and leading +
  const digits = value.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}

export function socialHref(value: string | undefined, platform: "instagram" | "linkedin") {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    const allowed = [`${platform}.com`, `www.${platform}.com`];
    return url.protocol === "https:" && !url.username && !url.password &&
      allowed.includes(url.hostname) && url.pathname !== "/" ? url.href : undefined;
  } catch {
    return undefined;
  }
}
