"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, BarChart3, Eye, Users, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { analyticsApi } from "@/lib/analytics";
import type { JobAnalyticsResponse } from "@/types";
import Link from "next/link";

export default function JobAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = Number(params.id);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["job-analytics", jobId],
    queryFn: () => analyticsApi.getJobAnalytics(jobId) as Promise<JobAnalyticsResponse>,
    enabled: !!jobId,
  });

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Job
        </button>
        <span className="text-zinc-300 dark:text-zinc-600">|</span>
        <Link href="/dashboard/jobs" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
          All Jobs
        </Link>
      </div>

      <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Analytics</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Performance metrics for this job listing.</p>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-2">
              <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-700 animate-pulse rounded" />
              <div className="h-6 w-20 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-16">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Failed to load analytics</p>
          <p className="text-xs text-zinc-500 mt-1">{error instanceof Error ? error.message : "Something went wrong"}</p>
        </div>
      )}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
              <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                <Eye className="h-4 w-4 text-indigo-500" /> Total Views
              </div>
              <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">{data.analytics.total_views ?? 0}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
              <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                <Users className="h-4 w-4 text-emerald-500" /> Total Applications
              </div>
              <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">{data.analytics.total_applications ?? 0}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
              <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                <TrendingUp className="h-4 w-4 text-amber-500" /> Conversion Rate
              </div>
              <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                {data.analytics.total_views && data.analytics.total_views > 0
                  ? `${((data.analytics.total_applications / data.analytics.total_views) * 100).toFixed(1)}%`
                  : "N/A"}
              </p>
            </div>
          </div>

          {data.analytics.daily && data.analytics.daily.length > 0 && (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
              <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-4">Daily Views &amp; Applications</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.analytics.daily} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.87 0 0 / 0.3)" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fill: "oklch(0.64 0 0)" }}
                      tickLine={false}
                      tickFormatter={(v: string) => {
                        const d = new Date(v);
                        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                      }}
                    />
                    <YAxis tick={{ fontSize: 12, fill: "oklch(0.64 0 0)" }} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid oklch(0.87 0 0 / 0.3)",
                        fontSize: "13px",
                      }}
                      labelFormatter={(v: string) => new Date(v).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                    <Bar dataKey="views" name="Views" fill="oklch(0.55 0.15 260)" radius={[4, 4, 0, 0]} maxBarSize={32} />
                    <Bar dataKey="applications" name="Applications" fill="oklch(0.6 0.18 160)" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
