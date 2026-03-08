declare global {
  interface Window {
    fbq?: (...args: [string, ...unknown[]]) => void;
  }
}

export function trackPageView(): void {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "PageView");
  }
}

export function trackLead(params?: Record<string, string>): void {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead", params);
  }
}

export function trackInitiateCheckout(
  params?: Record<string, string | number>,
): void {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "InitiateCheckout", params);
  }
}

export function trackPurchase(
  params?: Record<string, string | number>,
): void {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", params);
  }
}
