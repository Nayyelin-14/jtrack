"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Eye, Users, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { analyticsApi } from "@/lib/analytics";
import type { JobAnalyticsResponse } from "@/types";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Job
        </button>
        <span className="text-border">|</span>
        <Link href="/dashboard/jobs" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          All Jobs
        </Link>
      </div>

      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-xs text-muted-foreground">Performance metrics for this job listing.</p>
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5 space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isError && (
        <Card className="border-destructive/30">
          <CardContent className="grid place-items-center py-16 text-center">
            <p className="text-sm font-medium text-foreground">Failed to load analytics</p>
            <p className="text-xs text-muted-foreground mt-1">{error instanceof Error ? error.message : "Something went wrong"}</p>
          </CardContent>
        </Card>
      )}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Eye className="h-4 w-4 text-primary" /> Total Views
                </div>
                <p className="font-display text-2xl font-bold text-foreground">{data.analytics.total_views ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Users className="h-4 w-4 text-success" /> Total Applications
                </div>
                <p className="font-display text-2xl font-bold text-foreground">{data.analytics.total_applications ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <TrendingUp className="h-4 w-4 text-primary" /> Conversion Rate
                </div>
                <p className="font-display text-2xl font-bold text-foreground">
                  {data.analytics.total_views && data.analytics.total_views > 0
                    ? `${((data.analytics.total_applications / data.analytics.total_views) * 100).toFixed(1)}%`
                    : "N/A"}
                </p>
              </CardContent>
            </Card>
          </div>

          {data.analytics.daily && data.analytics.daily.length > 0 && (
            <Card>
              <CardContent className="p-5">
                <h2 className="text-sm font-semibold mb-4">Daily Views &amp; Applications</h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.analytics.daily} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                        tickLine={false}
                        tickFormatter={(v: string) => {
                          const d = new Date(v);
                          return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                        }}
                      />
                      <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid var(--border)",
                          fontSize: "13px",
                        }}
                        labelFormatter={(v: string) => new Date(v).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                      <Bar dataKey="views" name="Views" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={32} />
                      <Bar dataKey="applications" name="Applications" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
