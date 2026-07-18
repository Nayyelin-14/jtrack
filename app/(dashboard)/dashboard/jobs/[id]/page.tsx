"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, MapPin, Clock, DollarSign, Eye, Users, Building2 } from "lucide-react";
import { jobApi } from "@/lib/jobs";
import type { JobDetailResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
      <div className="grid h-64 place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data?.job) {
    return (
      <Card className="border-destructive/30">
        <CardContent className="grid place-items-center py-16 text-center">
          <p className="text-sm font-medium text-foreground">Job not found</p>
          <p className="text-xs text-muted-foreground mt-1">{error instanceof Error ? error.message : "Could not load job"}</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard/jobs")}>Back to Jobs</Button>
        </CardContent>
      </Card>
    );
  }

  const job = data.job;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        <span className="text-border">|</span>
        <Link href="/dashboard/jobs" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          All Jobs
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={job.is_active ? "default" : "secondary"}>
              {job.is_active ? "Active" : "Inactive"}
            </Badge>
            {job.job_type && (
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />{job.job_type.replace(/_/g, " ")}
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{job.title}</h1>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
            {job.location && (
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
            )}
            {job.salary != null && (
              <span className="inline-flex items-center gap-1 font-medium text-foreground/70">
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
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/jobs/${jobId}/applications`}>
              <Users className="mr-1.5 h-3.5 w-3.5" /> Applications
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/jobs/${jobId}/analytics`}>
              <Eye className="mr-1.5 h-3.5 w-3.5" /> Analytics
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {job.description && (
          <Card>
            <CardContent className="p-5">
              <h2 className="text-sm font-semibold mb-2">Description</h2>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{job.description}</p>
            </CardContent>
          </Card>
        )}

        {job.role && (
          <Card>
            <CardContent className="p-5">
              <h2 className="text-sm font-semibold mb-2">Role</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{job.role}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {job.work_location && (
        <div className="text-xs text-muted-foreground">
          Work location: <span className="font-medium text-foreground">{job.work_location.replace(/_/g, " ")}</span>
        </div>
      )}
    </div>
  );
}
