"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, AlertCircle, FileText, ExternalLink } from "lucide-react";

interface TestPdfViewerProps {
  orderId: string;
}

type ViewerMode = "embed" | "external";

interface TestPdfState {
  url: string;
  testCode: string | null;
  mode: ViewerMode;
  expiresAt: string | null;
}

// Refresh an embedded signed URL 5 minutes before it actually expires, so a
// long practice-mode session never hits a dead link mid-exam. Only
// meaningful for mode "embed" (Pharos-hosted, storage_path tests); "external"
// tests (Cambridge's own digital sample player) never expire.
const REFRESH_MARGIN_MS = 5 * 60_000;

/**
 * Gets the student to their assigned test, one of two ways depending on
 * where it comes from (see supabase/migrations/001_init.sql, "Seed the
 * test bank", for the full story — decided Sep 2026 after the old
 * book-derived test bank turned out to have no commercial license):
 *
 *  - "embed": a Reading & Use of English PDF that Pharos has curated
 *    (Cambridge's answer key stripped out) and hosts itself, privately —
 *    embedded right here in an iframe via a short-lived signed URL, same
 *    as the original design.
 *  - "external": one of the two Cambridge-hosted digital sample tests —
 *    nothing Pharos hosts, so this just sends the student there in a new
 *    tab; they solve it there and come back to answer on the right.
 */
export function TestPdfViewer({ orderId }: TestPdfViewerProps) {
  const [state, setState] = useState<TestPdfState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchUrl = useCallback(async () => {
    try {
      const res = await fetch(`/api/exam/${orderId}/test-pdf`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Could not load your test.");
      }

      setState({
        url: data.url,
        testCode: data.testCode ?? null,
        mode: data.mode === "external" ? "external" : "embed",
        expiresAt: data.expiresAt ?? null,
      });
      setError(null);

      if (data.expiresAt) {
        const expiresInMs = new Date(data.expiresAt).getTime() - Date.now();
        const nextRefreshMs = Math.max(30_000, expiresInMs - REFRESH_MARGIN_MS);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(fetchUrl, nextRefreshMs);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load your test."
      );
    }
  }, [orderId]);

  useEffect(() => {
    fetchUrl();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [fetchUrl]);

  if (error) {
    return (
      <div className="card flex h-full min-h-[400px] flex-col items-center justify-center gap-3 p-8 text-center">
        <AlertCircle className="h-8 w-8 text-red-400" strokeWidth={1.5} />
        <p className="font-body text-sm text-navy-600">{error}</p>
        <p className="font-body text-xs text-navy-400">
          If you already have your test from another source, you can keep
          answering on the right.
        </p>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="card flex h-full min-h-[400px] flex-col items-center justify-center gap-3 p-8 text-center">
        <Loader2
          className="h-8 w-8 animate-spin text-navy-400"
          strokeWidth={1.5}
        />
        <p className="font-body text-sm text-navy-500">
          Loading your test...
        </p>
      </div>
    );
  }

  if (state.mode === "external") {
    return (
      <div className="card flex h-full min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center">
        <FileText className="h-10 w-10 text-navy-400" strokeWidth={1.5} />
        <div>
          <p className="font-body text-sm font-medium text-navy-700">
            Your test is ready
          </p>
          <p className="mt-1 font-body text-xs text-navy-500">
            Official, free Cambridge English material
            {state.testCode ? ` (${state.testCode})` : ""}. Pharos links to
            it directly and is not affiliated with Cambridge English.
          </p>
        </div>
        <a
          href={state.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2"
        >
          Open your test
          <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
        </a>
        <p className="font-body text-xs text-navy-400">
          It opens in a new tab. Solve it there, then come back here and
          enter your answers on the right.
        </p>
      </div>
    );
  }

  return (
    <div className="card flex h-full flex-col overflow-hidden p-0">
      <div className="flex items-center justify-between gap-2 border-b border-navy-100 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-navy-400" strokeWidth={1.5} />
          <span className="font-body text-xs font-medium text-navy-500">
            Your Test
          </span>
        </div>
        <span className="font-body text-[11px] text-navy-400">
          Official, free Cambridge English material — also downloadable
          directly from cambridgeenglish.org. Pharos is not affiliated with
          Cambridge English.
        </span>
      </div>
      <iframe
        src={`${state.url}#toolbar=0&navpanes=0&view=FitH`}
        title="Your exam test"
        className="h-full min-h-[600px] w-full flex-1"
      />
    </div>
  );
}
