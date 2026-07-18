"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Building2, Briefcase, Plus, ArrowRight, Users, Sparkles } from "lucide-react";
import { jobApi } from "@/lib/jobs";
import type { MyJobsResponse } from "@/types";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RecruiterDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data } = useQuery({
    queryKey: ["my-jobs"],
    queryFn: () => jobApi.myJobs() as Promise<MyJobsResponse>,
    staleTime: 30_000,
  });

  const totalApps = data?.jobs.reduce((sum, j) => sum + j.total_applications, 0) ?? 0;
  const activeJobs = data?.jobs.filter((j) => j.is_active).length ?? 0;

  const greeting =
    new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">{greeting}, {user?.name.split(" ")[0]}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your companies and job postings.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 sm:grid-rows-2">
        <Link href="/dashboard/jobs" className="group block sm:col-span-2 sm:row-span-2">
          <Card className="flex h-full flex-col justify-between transition-colors hover:border-foreground/20">
            <CardContent className="flex h-full flex-col justify-between p-6">
              <div className="flex items-start justify-between">
                <Briefcase className="h-5 w-5 text-primary" />
                <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-colors group-hover:text-primary" />
              </div>
              <div>
                <p className="font-display text-5xl font-semibold tracking-tight">{data?.jobs.length ?? 0}</p>
                <p className="mt-2 text-sm font-medium text-foreground">Job Listings</p>
                <p className="text-xs text-muted-foreground">{totalApps} total applicants</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/companies" className="group block">
          <Card className="h-full transition-colors hover:border-foreground/20">
            <CardContent className="flex h-full items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-foreground" />
                <p className="text-sm font-semibold">Companies</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-colors group-hover:text-primary" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/jobs/create" className="group block">
          <Card className="h-full border-primary/25 bg-primary/[0.06] transition-colors hover:border-primary/40">
            <CardContent className="flex h-full items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <Plus className="h-5 w-5 text-primary" />
                <p className="text-sm font-semibold">Post a Job</p>
              </div>
              <ArrowRight className="h-4 w-4 text-primary/60 transition-colors group-hover:text-primary" />
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-foreground" />
              <div>
                <p className="text-sm font-semibold">{activeJobs} active jobs</p>
                <p className="text-xs text-muted-foreground">{totalApps} total candidates</p>
              </div>
            </div>
            <Button asChild size="sm" variant="outline" className="gap-1.5">
              <Link href="/dashboard/jobs">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-foreground" />
              <div>
                <p className="text-sm font-semibold">AI Match Analysis</p>
                <p className="text-xs text-muted-foreground">Find the best candidates</p>
              </div>
            </div>
            <Badge variant="secondary">Coming soon</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
