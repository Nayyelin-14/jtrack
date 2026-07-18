"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, RefreshCw } from "lucide-react";
import { jobApi } from "@/lib/jobs";
import type { ApplicationsResponse, Application } from "@/types";
import { ApplicationCard } from "@/components/jobs/application-card";
import { Button } from "@/components/ui/button";

export function MyApplications() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["my-applications"],
    queryFn: () => jobApi.myApplications() as Promise<ApplicationsResponse>,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-center">
        <p className="text-sm font-medium text-destructive">Failed to load applications</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
        <Button onClick={() => refetch()} size="sm" variant="outline" className="mt-4">
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  if (!data || data.applications.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">You haven&apos;t applied to any jobs yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {data.applications.map((app: Application) => (
        <ApplicationCard key={app.application_id} application={app} />
      ))}
    </div>
  );
}
