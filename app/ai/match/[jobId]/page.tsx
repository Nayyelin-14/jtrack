"use client";

import { useParams } from "next/navigation";
import { Target } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { AnalyzeMatch } from "@/components/jobs/analyze-match";

export default function MatchAnalysisPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const numericJobId = Number(jobId);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold tracking-tight">Match Analysis</h1>
          <p className="text-xs text-muted-foreground">See how your profile aligns with this role.</p>
        </div>
        <AnalyzeMatch jobId={numericJobId} />
      </main>
    </div>
  );
}
