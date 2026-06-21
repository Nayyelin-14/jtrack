"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Briefcase, Clock, CheckCircle, XCircle, FileText, ArrowLeft, ListChecks } from "lucide-react";
import { jobApi } from "@/lib/jobs";
import type { ApplicationsResponse } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  Submitted: { label: "Submitted", variant: "secondary" },
  Applied: { label: "Applied", variant: "default" },
  Hired: { label: "Hired", variant: "outline" },
  Rejected: { label: "Rejected", variant: "destructive" },
};

export default function ApplicationsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-applications"],
    queryFn: () => jobApi.myApplications() as Promise<ApplicationsResponse>,
    staleTime: 30_000,
  });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
      </Link>

      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
          <ListChecks className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
          <p className="text-xs text-muted-foreground">{data?.count ?? 0} total applications</p>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/60 p-4 space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <Card className="border-destructive/30">
          <CardContent className="grid place-items-center py-16 text-center">
            <p className="text-sm font-medium text-foreground">Failed to load applications</p>
            <p className="text-xs text-muted-foreground mt-1">{error instanceof Error ? error.message : "Something went wrong"}</p>
          </CardContent>
        </Card>
      )}

      {data && data.applications.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="grid place-items-center py-16 text-center">
            <ListChecks className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="font-semibold">No applications yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              <Link href="/jobs" className="text-primary hover:underline">Browse jobs</Link> to find opportunities.
            </p>
            <Button asChild className="mt-4">
              <Link href="/jobs"><Briefcase className="mr-2 h-4 w-4" />Browse jobs</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {data && data.applications.length > 0 && (
        <div className="space-y-3">
          {data.applications.map((app, i) => {
            const cfg = statusConfig[app.status] || statusConfig.Submitted;
            return (
              <motion.div
                key={app.application_id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Card className="transition-all hover:shadow-elegant hover:-translate-y-0.5">
                  <CardContent className="flex items-start justify-between gap-4 p-5">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {app.job_title ?? `Job #${app.job_id}`}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        {app.company_name && <span>{app.company_name}</span>}
                        {app.match_score !== undefined && (
                          <><span>·</span><span className="font-medium text-primary">{app.match_score}% match</span></>
                        )}
                      </div>
                    </div>
                    <Badge variant={cfg.variant} className="shrink-0 capitalize gap-1">
                      {app.status === "Hired" ? <CheckCircle className="h-3 w-3" /> : app.status === "Rejected" ? <XCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {cfg.label}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
