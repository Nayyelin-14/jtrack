"use client";

import { useParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { AnalyzeMatch } from "@/components/jobs/analyze-match";

export default function MatchAnalysisPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const numericJobId = Number(jobId);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
            <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">Match Analysis</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">See how your profile aligns with this role.</p>
          </div>
        </div>
        <AnalyzeMatch jobId={numericJobId} />
      </main>
    </div>
  );
}
