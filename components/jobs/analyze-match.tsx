"use client";

import { useCallback, useState, useRef } from "react";
import { toast } from "sonner";
import { Sparkles, Loader2, CheckCircle2, AlertCircle, X, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { jobApi } from "@/lib/jobs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import type { AnalyzeMatchResult, SSEEvent } from "@/types";

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

  const score = result?.matchScore ?? 0;
  const scoreColor =
    score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : score >= 40 ? "bg-orange-500" : "bg-red-500";
  const scoreBorder =
    score >= 80 ? "border-emerald-400 dark:border-emerald-500" : score >= 60 ? "border-amber-400 dark:border-amber-500" : score >= 40 ? "border-orange-400 dark:border-orange-500" : "border-red-400 dark:border-red-500";
  const scoreText =
    score >= 80 ? "text-emerald-700 dark:text-emerald-300" : score >= 60 ? "text-amber-700 dark:text-amber-300" : score >= 40 ? "text-orange-700 dark:text-orange-300" : "text-red-700 dark:text-red-300";
  const scoreLabel =
    score >= 80 ? "Strong" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Low";

  const recIcon =
    result?.recommendation === "yes" ? TrendingUp
      : result?.recommendation === "no" ? TrendingDown
        : Minus;
  const recColor =
    result?.recommendation === "yes" ? "text-emerald-600 dark:text-emerald-400"
      : result?.recommendation === "no" ? "text-red-600 dark:text-red-400"
        : "text-amber-600 dark:text-amber-400";
  const recLabel =
    result?.recommendation === "yes" ? "Strong Match"
      : result?.recommendation === "no" ? "Weak Match"
        : "Moderate Match";
  const RecIcon = recIcon;

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
        <DialogContent
          className="w-full sm:max-w-[70%] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl border-zinc-200 dark:border-zinc-800 shadow-2xl [&>button.absolute]:hidden"
        >
          {/* Header */}
          <div className="shrink-0 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-500/[0.07] to-transparent border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 ring-1 ring-indigo-500/20">
                <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <DialogTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  AI Match Analysis
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                  How your profile aligns with this role
                </DialogDescription>
              </div>
            </div>
            <DialogClose className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <X className="h-4 w-4" />
            </DialogClose>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {result && (
              <div className="max-w-3xl mx-auto space-y-6">

                {/* Score hero */}
                <div className="flex items-center gap-5 p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
                    <svg className="h-20 w-20 -rotate-90 absolute" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="5" className="text-zinc-200 dark:text-zinc-700" />
                      <circle
                        cx="40" cy="40" r="34"
                        fill="none"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 34}`}
                        strokeDashoffset={`${2 * Math.PI * 34 * (1 - score / 100)}`}
                        className={`transition-all duration-1000 ease-out drop-shadow-sm ${score >= 80 ? "stroke-emerald-500" : score >= 60 ? "stroke-amber-500" : score >= 40 ? "stroke-orange-500" : "stroke-red-500"}`}
                      />
                    </svg>
                    <span className={`relative text-sm font-bold ${scoreText}`}>{score}%</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`h-2 w-2 rounded-full ${scoreColor}`} />
                      <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        {scoreLabel} match
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                      {result.summary}
                    </p>
                  </div>
                </div>

                {/* Summary + Recommendation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                      Summary
                    </p>
                    <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {result.summary}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                      Recommendation
                    </p>
                    <div className="flex items-center gap-2.5 mb-2">
                      <RecIcon className={`h-5 w-5 ${recColor}`} />
                      <span className={`text-sm font-semibold ${recColor}`}>{recLabel}</span>
                    </div>
                    {result.recommendationReason && (
                      <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {result.recommendationReason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Strengths & Gaps side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.strengths.length > 0 && (
                    <div className="rounded-xl bg-gradient-to-br from-emerald-500/[0.07] to-emerald-500/[0.02] border border-emerald-200/60 dark:border-emerald-900/30 p-4">
                      <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-3">
                        <CheckCircle2 className="h-4 w-4" />
                        Strengths
                      </p>
                      <ul className="space-y-2">
                        {result.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-300">
                            <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-emerald-500/60" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.gaps.length > 0 && (
                    <div className="rounded-xl bg-gradient-to-br from-amber-500/[0.07] to-amber-500/[0.02] border border-amber-200/60 dark:border-amber-900/30 p-4">
                      <p className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-300 mb-3">
                        <AlertCircle className="h-4 w-4" />
                        Areas to improve
                      </p>
                      <ul className="space-y-2">
                        {result.gaps.map((g, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-300">
                            <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-amber-500/60" />
                            {g}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
