"use client";

import { useEffect } from "react";
import { trackPurchase } from "@/lib/analytics";

export function ThankYouTracker() {
  useEffect(() => {
    trackPurchase({ content_name: "diagnostic_exam" });
  }, []);

  return null;
}
