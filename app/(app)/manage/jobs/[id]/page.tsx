"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Briefcase, MapPin, Clock, DollarSign, Eye, Users, Building2 } from "lucide-react";
import { jobApi } from "@/lib/job-api";
import type { JobDetailResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = Number(params.id);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => jobApi.jobDetail(jobId) as Promise<JobDetailResponse>,
    enabled: !!jobId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (isError || !data?.job) {
    return (
      <div className="text-center py-16">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Job not found</p>
        <p className="text-xs text-zinc-500 mt-1">{error instanceof Error ? error.message : "Could not load job"}</p>
        <Button variant="outline" className="mt-4 rounded-lg" onClick={() => router.push("/manage/jobs")}>Back to Jobs</Button>
      </div>
    );
  }

  const job = data.job;

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        <span className="text-zinc-300 dark:text-zinc-600">|</span>
        <Link href="/manage/jobs" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
          All Jobs
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              job.is_active ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
            }`}>
              {job.is_active ? "Active" : "Inactive"}
            </span>
            {job.job_type && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-400">
                <Clock className="h-3 w-3" />{job.job_type}
              </span>
            )}
          </div>
          <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">{job.title}</h1>
          <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1 flex-wrap">
            {job.location && (
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
            )}
            {job.salary != null && (
              <span className="inline-flex items-center gap-1 font-medium text-zinc-600 dark:text-zinc-400">
                <DollarSign className="h-3.5 w-3.5" />
                ${job.salary.toLocaleString()}
              </span>
            )}
            {job.company_name && (
              <span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{job.company_name}</span>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" asChild className="rounded-lg text-xs">
            <Link href={`/manage/jobs/${jobId}/applications`}>
              <Users className="h-3.5 w-3.5" /> Applications
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="rounded-lg text-xs">
            <Link href={`/manage/jobs/${jobId}/analytics`}>
              <Eye className="h-3.5 w-3.5" /> Analytics
            </Link>
          </Button>
        </div>
      </div>

      {job.description && (
        <div className="mb-6 max-w-prose">
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-2">Description</h2>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">{job.description}</p>
        </div>
      )}

      {job.role && (
        <div className="mb-6 max-w-prose">
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-2">Role</h2>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{job.role}</p>
        </div>
      )}

      {job.work_location && (
        <div className="text-xs text-zinc-500">
          Work location: <span className="font-medium text-zinc-700 dark:text-zinc-300">{job.work_location}</span>
        </div>
      )}
    </>
  );
}
