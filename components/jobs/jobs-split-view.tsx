"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, MapPin, Loader2, X, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { jobApi } from "@/lib/jobs";
import type { Job, ActiveJobsResponse, JobDetailResponse, ApplicationsResponse } from "@/types";
import { JobCard } from "@/components/jobs/job-card";
import { JobDetail } from "@/components/jobs/job-detail";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth-store";
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
      <div className="w-full md:w-[35%] min-w-0 flex flex-col border-b md:border-b-0 md:border-r border-border">
        {/* Search */}
        <div className="shrink-0 p-4 space-y-2.5 border-b border-border bg-muted/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search titles..."
              value={title}
              onChange={(e) => { setTitle(e.target.value); setPage(1); setSelectedJobId(null); }}
              className="h-10 pl-9 text-sm"
            />
            {title && (
              <button onClick={() => { setTitle(""); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter location..."
              value={location}
              onChange={(e) => { setLocation(e.target.value); setPage(1); setSelectedJobId(null); }}
              className="h-10 pl-9 text-sm"
            />
            {location && (
              <button onClick={() => { setLocation(""); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Count */}
        <div className="shrink-0 px-4 py-2.5 border-b border-border bg-muted/20">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{total}</span>{" "}
            position{total !== 1 ? "s" : ""}
          </p>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-border p-4 space-y-2.5 bg-card">
                <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                <div className="h-3 w-1/3 bg-muted/60 animate-pulse rounded" />
              </div>
            ))
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <p className="text-sm font-medium text-foreground">Failed to load</p>
              <p className="text-xs text-muted-foreground mt-1">
                {error instanceof Error ? error.message : "Something went wrong"}
              </p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <p className="text-sm text-muted-foreground">No jobs match your search</p>
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
          <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/30">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Prev
            </button>
            <span className="text-xs font-medium text-muted-foreground/70">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
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
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto">
                <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Select a job to view details</p>
            </div>
          </div>
        ) : detailLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : detailData?.job ? (
          <div>
            <div className="sticky top-0 z-10 flex items-center justify-end px-6 py-3 border-b border-border bg-card">
              <Link
                href={`/jobs/${selectedJobId}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
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
