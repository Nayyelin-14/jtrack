"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Loader2, Briefcase, Clock, CheckCircle, XCircle, FileText, ArrowLeft } from "lucide-react";
import { jobApi } from "@/lib/jobs";
import type { ApplicationsResponse } from "@/types";

const statusConfig: Record<string, { label: string; class: string }> = {
  Submitted: { label: "Submitted", class: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  Applied: { label: "Applied", class: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
  Hired: { label: "Hired", class: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
  Rejected: { label: "Rejected", class: "bg-red-500/10 text-red-700 dark:text-red-400" },
};

export default function ApplicationsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-applications"],
    queryFn: () => jobApi.myApplications() as Promise<ApplicationsResponse>,
    staleTime: 30_000,
  });

  return (
    <>
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
      </Link>
      <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Applications</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{data?.count ?? 0} total applications</p>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-2">
              <div className="h-4 w-36 bg-zinc-200 dark:bg-zinc-700 animate-pulse rounded" />
              <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-16">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Failed to load applications</p>
          <p className="text-xs text-zinc-500 mt-1">{error instanceof Error ? error.message : "Something went wrong"}</p>
        </div>
      )}

      {data && data.applications.length === 0 && (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3">
            <FileText className="h-6 w-6 text-zinc-400" />
          </div>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">No applications yet</p>
          <p className="text-xs text-zinc-500 mt-1">
            <Link href="/jobs" className="text-indigo-600 dark:text-indigo-400 hover:underline">Browse jobs</Link> to find opportunities.
          </p>
        </div>
      )}

      {data && data.applications.length > 0 && (
        <div className="space-y-3">
          {data.applications.map((app) => {
            const cfg = statusConfig[app.status] || statusConfig.Submitted;
            return (
              <div key={app.application_id} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate">
                      {app.job_title ?? `Job #${app.job_id}`}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                      {app.company_name && <span>{app.company_name}</span>}
                      {app.match_score !== undefined && (
                        <><span>·</span><span className="font-medium text-indigo-600 dark:text-indigo-400">{app.match_score}% match</span></>
                      )}
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.class}`}>
                    {app.status === "Hired" ? <CheckCircle className="h-3 w-3" /> : app.status === "Rejected" ? <XCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {cfg.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
