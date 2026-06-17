"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { UserIcon, Mail, ShieldCheck, ArrowUpRight, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth-store";
import { jobApi } from "@/lib/job-api";
import type { ApplicationsResponse } from "@/lib/types";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const isRecruiter = user?.role === "recruiter";

  const { data: appsData } = useQuery({
    queryKey: ["my-applications"],
    queryFn: () => jobApi.myApplications() as Promise<ApplicationsResponse>,
    enabled: !isRecruiter,
    staleTime: 30_000,
  });

  return (
    <>
      <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
        Welcome back, {user?.name.split(" ")[0]}
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        {isRecruiter ? "Manage your companies and job postings." : "Track your job applications."}
      </p>

      {!isRecruiter && (
        <div className="grid gap-4 sm:grid-cols-2 mb-8">
          <Link href="/jobs" className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Browse Jobs</p>
                <p className="text-xs text-zinc-500">{appsData?.count ?? 0} applications submitted</p>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
          </Link>
          <Link href="/dashboard/profile" className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <UserIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Your Profile</p>
                <p className="text-xs text-zinc-500">Update your information</p>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
          </Link>
        </div>
      )}

      {isRecruiter && (
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <Link href="/companies" className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 mb-0.5">Companies</p>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Manage companies</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
          </Link>
          <Link href="/manage/jobs/create" className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 mb-0.5">Post a Job</p>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Create listing</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
          </Link>
          <Link href="/manage/jobs" className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 mb-0.5">Job Listings</p>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">View all jobs</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
          </Link>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-500">
              <UserIcon className="h-4 w-4" /> Name
            </CardTitle>
          </CardHeader>
          <CardContent className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
            {user?.name}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-500">
              <Mail className="h-4 w-4" /> Email
            </CardTitle>
          </CardHeader>
          <CardContent className="break-all text-base font-semibold text-zinc-800 dark:text-zinc-100">
            {user?.email}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-500">
              <ShieldCheck className="h-4 w-4" /> Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-medium capitalize text-indigo-700 dark:text-indigo-300">
              {user?.role}
            </span>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
