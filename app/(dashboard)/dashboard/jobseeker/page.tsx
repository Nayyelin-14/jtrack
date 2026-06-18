"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, FileText, UserRound, ArrowUpRight } from "lucide-react";
import { jobApi } from "@/lib/jobs";
import type { ApplicationsResponse } from "@/types";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent } from "@/components/ui/card";

export default function JobseekerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data } = useQuery({
    queryKey: ["my-applications"],
    queryFn: () => jobApi.myApplications() as Promise<ApplicationsResponse>,
    staleTime: 30_000,
  });

  return (
    <>
      <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Welcome back, {user?.name.split(" ")[0]}</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Track your job applications and find new opportunities.</p>

      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        <Link href="/jobs" className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
              <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Browse Jobs</p>
              <p className="text-xs text-zinc-500">{data?.count ?? 0} applications submitted</p>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
        </Link>
        <Link href="/dashboard/applications" className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Applications</p>
              <p className="text-xs text-zinc-500">View your submitted applications</p>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
        </Link>
        <Link href="/dashboard/skills" className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <UserRound className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Skills</p>
              <p className="text-xs text-zinc-500">Manage your skills</p>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-zinc-400 group-hover:text-amber-500 transition-colors" />
        </Link>
      </div>
    </>
  );
}
