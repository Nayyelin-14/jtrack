"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, FileText, UserRound, ArrowRight, Sparkles } from "lucide-react";
import { jobApi } from "@/lib/jobs";
import type { ApplicationsResponse } from "@/types";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function JobseekerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data } = useQuery({
    queryKey: ["my-applications"],
    queryFn: () => jobApi.myApplications() as Promise<ApplicationsResponse>,
    staleTime: 30_000,
  });

  const greeting =
    new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">{greeting}, {user?.name.split(" ")[0]}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track your job applications and find new opportunities.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 sm:grid-rows-2">
        <Link href="/dashboard/applications" className="group block sm:col-span-2 sm:row-span-2">
          <Card className="flex h-full flex-col justify-between transition-colors hover:border-foreground/20">
            <CardContent className="flex h-full flex-col justify-between p-6">
              <div className="flex items-start justify-between">
                <FileText className="h-5 w-5 text-primary" />
                <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-colors group-hover:text-primary" />
              </div>
              <div>
                <p className="font-display text-5xl font-semibold tracking-tight">{data?.count ?? 0}</p>
                <p className="mt-2 text-sm font-medium text-foreground">Applications</p>
                <p className="text-xs text-muted-foreground">View your submitted applications</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/jobs" className="group block">
          <Card className="h-full transition-colors hover:border-foreground/20">
            <CardContent className="flex h-full items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-foreground" />
                <p className="text-sm font-semibold">Browse Jobs</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-colors group-hover:text-primary" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/skills" className="group block">
          <Card className="h-full transition-colors hover:border-foreground/20">
            <CardContent className="flex h-full items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <UserRound className="h-5 w-5 text-foreground" />
                <p className="text-sm font-semibold">Skills</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-colors group-hover:text-primary" />
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-primary/25 bg-primary/[0.06] p-5">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold">AI Career Guidance</p>
            <p className="text-xs text-muted-foreground">Get personalized career advice powered by AI.</p>
          </div>
        </div>
        <Button asChild size="sm" className="gap-1.5">
          <Link href="/ai/career-guidance">Try it <ArrowRight className="h-3.5 w-3.5" /></Link>
        </Button>
      </div>
    </div>
  );
}
