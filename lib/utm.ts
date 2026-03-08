const UTM_STORAGE_KEY = "pharos_utm";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type UtmParams = Partial<
  Record<(typeof UTM_KEYS)[number], string>
>;

export function captureUtmParams(): void {
  if (typeof window === "undefined") return;

  const searchParams = new URLSearchParams(window.location.search);
  const utmParams: UtmParams = {};
  let hasUtm = false;

  for (const key of UTM_KEYS) {
    const value = searchParams.get(key);
    if (value) {
      utmParams[key] = value;
      hasUtm = true;
    }
  }

  if (hasUtm) {
    try {
      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmParams));
    } catch {
      // localStorage may be unavailable (private browsing, quota exceeded)
    }
  }
}

export function getUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(UTM_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as UtmParams;
    }
  } catch {
    // localStorage may be unavailable or contain invalid JSON
  }

  return {};
}
