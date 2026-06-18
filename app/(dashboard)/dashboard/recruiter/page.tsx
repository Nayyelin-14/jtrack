"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Building2, Briefcase, Plus, ArrowUpRight } from "lucide-react";
import { jobApi } from "@/lib/jobs";
import type { MyJobsResponse } from "@/types";
import { useAuthStore } from "@/store/auth-store";

export default function RecruiterDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data } = useQuery({
    queryKey: ["my-jobs"],
    queryFn: () => jobApi.myJobs() as Promise<MyJobsResponse>,
    staleTime: 30_000,
  });

  const totalApps = data?.jobs.reduce((sum, j) => sum + j.total_applications, 0) ?? 0;

  return (
    <>
      <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Welcome back, {user?.name.split(" ")[0]}</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Manage your companies and job postings.</p>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Link href="/dashboard/companies" className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500 mb-0.5">Companies</p>
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Manage companies</p>
          </div>
          <ArrowUpRight className="h-4 w-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
        </Link>
        <Link href="/dashboard/jobs/create" className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500 mb-0.5">Post a Job</p>
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Create listing</p>
          </div>
          <ArrowUpRight className="h-4 w-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
        </Link>
        <Link href="/dashboard/jobs" className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500 mb-0.5">{data?.jobs.length ?? 0} Job Listings</p>
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{totalApps} total applicants</p>
          </div>
          <ArrowUpRight className="h-4 w-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
        </Link>
      </div>
    </>
  );
}
