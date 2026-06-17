"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, MapPin, Loader2, X, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { jobApi } from "@/lib/job-api";
import type { Job, ActiveJobsResponse, JobDetailResponse, ApplicationsResponse } from "@/lib/types";
import { JobCard } from "@/components/jobs/job-card";
import { JobDetail } from "@/components/jobs/job-detail";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";

export function JobsSplitView() {
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);

  const debouncedTitle = useDebounce(title, 350);
  const debouncedLocation = useDebounce(location, 350);

  const user = useAuthStore((s) => s.user);
  const isSeeker = user?.role === "jobseeker";

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["active-jobs", debouncedTitle, debouncedLocation, page],
    queryFn: () => jobApi.activeJobs({ title: debouncedTitle, location: debouncedLocation, page }) as Promise<ActiveJobsResponse>,
  });

  const { data: detailData, isLoading: detailLoading } = useQuery({
    queryKey: ["job", String(selectedJobId)],
    queryFn: () => jobApi.jobDetail(selectedJobId!) as Promise<JobDetailResponse>,
    enabled: !!selectedJobId,
  });

  const { data: appsData } = useQuery({
    queryKey: ["my-applications"],
    queryFn: () => jobApi.myApplications() as Promise<ApplicationsResponse>,
    enabled: isSeeker,
    staleTime: 30_000,
  });

  const alreadyApplied = selectedJobId
    ? appsData?.applications?.some((a) => a.job_id === selectedJobId) ?? false
    : false;

  const jobs = data?.jobs ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-[calc(100vh-4rem)]">
      {/* Left panel: 35% */}
      <div className="w-full md:w-[35%] min-w-0 flex flex-col border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800">
        {/* Search */}
        <div className="shrink-0 p-4 space-y-2.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search titles..."
              value={title}
              onChange={(e) => { setTitle(e.target.value); setPage(1); setSelectedJobId(null); }}
              className="h-9 rounded-lg border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-9 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
            />
            {title && (
              <button onClick={() => { setTitle(""); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Filter location..."
              value={location}
              onChange={(e) => { setLocation(e.target.value); setPage(1); setSelectedJobId(null); }}
              className="h-9 rounded-lg border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-9 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
            />
            {location && (
              <button onClick={() => { setLocation(""); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Count */}
        <div className="shrink-0 px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/20">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold text-zinc-700 dark:text-zinc-200">{total}</span>{" "}
            position{total !== 1 ? "s" : ""}
          </p>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg border-2 border-zinc-200 dark:border-zinc-800 p-4 space-y-2.5 bg-white dark:bg-zinc-900/40">
                <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-700 animate-pulse rounded" />
                <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-700 animate-pulse rounded" />
                <div className="h-3 w-1/3 bg-zinc-100 dark:bg-zinc-700 animate-pulse rounded" />
              </div>
            ))
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Failed to load</p>
              <p className="text-xs text-zinc-400 mt-1">
                {error instanceof Error ? error.message : "Something went wrong"}
              </p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <p className="text-sm text-zinc-400">No jobs match your search</p>
            </div>
          ) : (
            jobs.map((job: Job) => (
              <JobCard
                key={job.job_id}
                job={job}
                onSelect={(j) => setSelectedJobId(j.job_id)}
                isSelected={selectedJobId === job.job_id}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Prev
            </button>
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors disabled:opacity-30"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Right panel: 65% */}
      <div className="w-full md:w-[65%] min-w-0 overflow-y-auto">
        {!selectedJobId ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto">
                <ArrowUpRight className="h-5 w-5 text-zinc-400" />
              </div>
              <p className="text-sm text-zinc-400">Select a job to view details</p>
            </div>
          </div>
        ) : detailLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
          </div>
        ) : detailData?.job ? (
          <div>
            <div className="sticky top-0 z-10 flex items-center justify-end px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm">
              <Link
                href={`/jobs/${selectedJobId}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
              >
                Open full page <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="p-6">
              <JobDetail
                job={detailData.job}
                isSeeker={isSeeker}
                hasApplied={alreadyApplied}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
