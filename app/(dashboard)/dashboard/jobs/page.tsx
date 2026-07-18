"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Plus, Briefcase, Loader2, MapPin, Clock, Users, Eye } from "lucide-react";
import { jobApi } from "@/lib/jobs";
import type { MyJobsResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-jobs"],
    queryFn: () => jobApi.myJobs() as Promise<MyJobsResponse>,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">My Job Listings</h1>
          <p className="text-xs text-muted-foreground">Jobs posted by your companies.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/jobs/create">
            <Plus className="h-4 w-4" /> New Job
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isError && (
        <Card className="border-destructive/30">
          <CardContent className="grid place-items-center py-16 text-center">
            <p className="text-sm font-medium text-foreground">Failed to load jobs</p>
            <p className="text-xs text-muted-foreground mt-1">{error instanceof Error ? error.message : "Something went wrong"}</p>
          </CardContent>
        </Card>
      )}

      {data && data.jobs.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="grid place-items-center py-16 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-lg bg-primary/10 mb-4">
              <Briefcase className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">No jobs yet</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">Create your first job listing.</p>
            <Button asChild className="mt-5 gap-2">
              <Link href="/dashboard/jobs/create"><Plus className="h-4 w-4" /> Post a Job</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {data && data.jobs.length > 0 && (
        <div className="space-y-3">
          {data.jobs.map((job) => (
            <div key={job.job_id}>
              <Card className="transition-all hover:shadow-sm hover:-translate-y-0.5">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/dashboard/jobs/${job.job_id}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {job.title}
                      </Link>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                        {job.company_name && <span>{job.company_name}</span>}
                        {job.location && (
                          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                        )}
                        {job.job_type && (
                          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{job.job_type.replace(/_/g, " ")}</span>
                        )}
                        {job.salary != null && (
                          <span className="font-medium text-foreground/70">${job.salary.toLocaleString()}</span>
                        )}
                        <span className="inline-flex items-center gap-1 text-primary">
                          <Users className="h-3 w-3" />{job.total_applications} applicant{job.total_applications !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={job.is_active ? "default" : "secondary"}>
                        {job.is_active ? "Active" : "Paused"}
                      </Badge>
                      <Link
                        href={`/dashboard/jobs/${job.job_id}/applications`}
                        className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent transition-colors"
                      >
                        <Users className="h-3.5 w-3.5" /> Applicants
                      </Link>
                      <Link
                        href={`/dashboard/jobs/${job.job_id}`}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors shrink-0"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
