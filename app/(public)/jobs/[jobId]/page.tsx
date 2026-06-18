"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Loader2, RefreshCw, ArrowLeft } from "lucide-react";
import { jobApi } from "@/lib/jobs";
import type { JobDetailResponse, ApplicationsResponse } from "@/types";
import { useAuthStore } from "@/store/auth-store";
import { JobDetail } from "@/components/jobs/job-detail";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const numericJobId = Number(jobId);

  const { data: res, isLoading: jobLoading, isError: jobError, error: jobErr, refetch: refetchJob } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => jobApi.jobDetail(numericJobId) as Promise<JobDetailResponse>,
    enabled: !!jobId,
  });

  const user = useAuthStore((s) => s.user);
  const isSeeker = user?.role === "jobseeker";

  const { data: appsData } = useQuery({
    queryKey: ["my-applications"],
    queryFn: () => jobApi.myApplications() as Promise<ApplicationsResponse>,
    enabled: isSeeker,
    staleTime: 30_000,
  });

  const alreadyApplied = appsData?.applications?.some(
    (a) => a.job_id === numericJobId
  ) ?? false;

  if (jobLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (jobError) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <p className="text-sm font-medium text-destructive">Failed to load job</p>
          <p className="text-xs text-muted-foreground">
            {jobErr instanceof Error ? jobErr.message : "Something went wrong"}
          </p>
          <Button onClick={() => refetchJob()} size="sm" variant="outline">
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!res?.job) return null;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/jobs">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to jobs
          </Link>
        </Button>
        <JobDetail job={res.job} isSeeker={isSeeker} hasApplied={alreadyApplied} />
      </main>
    </div>
  );
}
