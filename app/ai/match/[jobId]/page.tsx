"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
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
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-6">
            <div className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
              <Target className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Match Analysis</h1>
              <p className="text-xs text-muted-foreground">See how your profile aligns with this role.</p>
            </div>
          </div>
        </motion.div>
        <AnalyzeMatch jobId={numericJobId} />
      </main>
    </div>
  );
}
