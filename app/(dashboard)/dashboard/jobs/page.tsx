"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Plus, FileText, Loader2, MapPin, Clock, Users, Eye } from "lucide-react";
import { jobApi } from "@/lib/jobs";
import type { MyJobsResponse } from "@/types";
import { Button } from "@/components/ui/button";

export default function JobsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-jobs"],
    queryFn: () => jobApi.myJobs() as Promise<MyJobsResponse>,
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-1">My Job Listings</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Jobs posted by your companies.</p>
        </div>
        <Button asChild className="rounded-lg">
          <Link href="/dashboard/jobs/create">
            <Plus className="mr-1.5 h-4 w-4" /> New Job
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-2">
              <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-700 animate-pulse rounded" />
              <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
              <div className="h-3 w-32 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-16">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Failed to load jobs</p>
          <p className="text-xs text-zinc-500 mt-1">{error instanceof Error ? error.message : "Something went wrong"}</p>
        </div>
      )}

      {data && data.jobs.length === 0 && (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3">
            <FileText className="h-6 w-6 text-zinc-400" />
          </div>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">No jobs found</p>
          <p className="text-xs text-zinc-500 mt-1">Create your first job listing.</p>
          <Button asChild className="mt-4 rounded-lg">
            <Link href="/dashboard/jobs/create">Post a Job</Link>
          </Button>
        </div>
      )}

      {data && data.jobs.length > 0 && (
        <div className="space-y-3">
          {data.jobs.map((job) => (
            <div key={job.job_id} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <Link href={`/dashboard/jobs/${job.job_id}`} className="font-semibold text-sm text-zinc-800 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {job.title}
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                    {job.company_name && <span>{job.company_name}</span>}
                    {job.location && (
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                    )}
                    {job.job_type && (
                      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{job.job_type}</span>
                    )}
                    {job.salary != null && (
                      <span className="font-medium text-zinc-600 dark:text-zinc-400">
                        ${job.salary.toLocaleString()}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                      <Users className="h-3 w-3" />{job.total_applications} applicant{job.total_applications !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/dashboard/jobs/${job.job_id}/applications`}
                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Users className="h-3.5 w-3.5" /> Applicants
                  </Link>
                  <Link
                    href={`/dashboard/jobs/${job.job_id}`}
                    className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-indigo-500 transition-colors shrink-0"
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
