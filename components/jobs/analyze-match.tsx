"use client";

import { useCallback, useState, useRef } from "react";
import { toast } from "sonner";
import { Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { jobApi } from "@/lib/job-api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { AnalyzeMatchResult, SSEEvent } from "@/lib/types";

export function AnalyzeMatch({ jobId }: { jobId: number }) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<AnalyzeMatchResult | null>(null);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const start = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setProgress("Starting analysis\u2026");
    setResult(null);

    function extractResult(event: SSEEvent): AnalyzeMatchResult | null {
      if (event.result) return event.result;
      if ("matchScore" in event) {
        return {
          matchScore: (event as any).matchScore,
          strengths: (event as any).strengths ?? [],
          gaps: (event as any).gaps ?? [],
          recommendation: (event as any).recommendation ?? "maybe",
          recommendationReason: (event as any).recommendationReason ?? "",
          summary: (event as any).summary ?? "",
          fullAnalysis: (event as any).fullAnalysis ?? "",
        };
      }
      return null;
    }

    try {
      await jobApi.analyzeMatch(jobId, {
        onProgress: (message) => setProgress(message),
        onChunk: () => {},
        onComplete: (event) => {
          const r = extractResult(event);
          if (r) {
            setResult(r);
            setOpen(true);
          }
          setProgress(null);
        },
        onError: (message) => {
          toast.error(message);
          setProgress(null);
        },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis request failed");
      setProgress(null);
    } finally {
      setRunning(false);
    }
  }, [jobId, running]);

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        onClick={start}
        disabled={running}
        className="w-full sm:w-auto"
      >
        {running ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        AI Match Analysis
      </Button>

      {running && progress && (
        <p className="text-xs text-muted-foreground">{progress}</p>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Match Analysis
            </DialogTitle>
            <DialogDescription>
              AI-powered breakdown of how your profile aligns with this role.
            </DialogDescription>
          </DialogHeader>

          {result && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 rounded-xl bg-primary/5 p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                  {result.matchScore}%
                </div>
                <div>
                  <p className="text-sm font-medium">Overall Match</p>
                  <p className="text-xs text-muted-foreground">{result.summary}</p>
                </div>
              </div>

              {result.recommendation && (
                <div className="rounded-lg border border-border/40 bg-card/50 px-4 py-3 text-sm">
                  <span className="font-medium">Recommendation: </span>
                  <span
                    className={
                      result.recommendation === "yes"
                        ? "text-emerald-600"
                        : result.recommendation === "no"
                          ? "text-destructive"
                          : "text-amber-600"
                    }
                  >
                    {result.recommendation.toUpperCase()}
                  </span>
                  <p className="mt-1 text-muted-foreground">
                    {result.recommendationReason}
                  </p>
                </div>
              )}

              <div>
                <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" /> Strengths
                </p>
                <ul className="space-y-1">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-amber-600">
                  <AlertCircle className="h-4 w-4" /> Gaps
                </p>
                <ul className="space-y-1">
                  {result.gaps.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
