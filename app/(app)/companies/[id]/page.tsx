"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, Building2, Globe, MapPin, Users, Trash2, ExternalLink, ArrowLeft, Briefcase, Plus } from "lucide-react";
import { companyApi } from "@/lib/company-api";
import type { CompanyDetailResponse, JobDetailResponse } from "@/lib/types";
import { jobApi } from "@/lib/job-api";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const isRecruiter = user?.role === "recruiter";
  const companyId = Number(params.id);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => companyApi.getDetail(companyId) as Promise<CompanyDetailResponse>,
    enabled: !!companyId,
  });

  const remove = useMutation({
    mutationFn: () => companyApi.remove(companyId),
    onSuccess: () => {
      toast.success("Company deleted");
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      router.push("/companies");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (isError || !data?.company) {
    return (
      <div className="text-center py-16">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Company not found</p>
        <p className="text-xs text-zinc-500 mt-1">{error instanceof Error ? error.message : "Could not load company"}</p>
      </div>
    );
  }

  const company = data.company;

  return (
    <>
      <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          {company.logo ? (
            <img src={company.logo} alt="" className="h-14 w-14 rounded-xl object-contain bg-white ring-1 ring-zinc-200 dark:ring-zinc-700" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
              <Building2 className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">{company.name}</h1>
            <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
              {company.industry && <span>{company.industry}</span>}
              {company.size && <><span>·</span><span>{company.size}</span></>}
              {company.location && <><span>·</span><span>{company.location}</span></>}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {company.website && (
            <a href={company.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-indigo-600 transition-colors">
              <Globe className="h-3.5 w-3.5" /> Website
            </a>
          )}
          {isRecruiter && (
            <>
              <Button variant="outline" size="sm" asChild className="rounded-lg text-xs">
                <Link href={`/manage/jobs/create`}>
                  <Plus className="h-3.5 w-3.5" /> New Job
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => remove.mutate()} disabled={remove.isPending} className="text-red-500 hover:text-red-600 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg text-xs">
                {remove.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {company.description && (
        <div className="mb-6 max-w-prose">
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{company.description}</p>
        </div>
      )}

      {company.jobs && company.jobs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-3">Jobs at {company.name}</h2>
          <div className="space-y-2">
            {company.jobs.map((job) => (
              <Link
                key={job.job_id}
                href={isRecruiter ? `/manage/jobs/${job.job_id}` : `/jobs/${job.job_id}`}
                className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group"
              >
                <div>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{job.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{job.location} {(job.salary != null) && `· $${job.salary.toLocaleString()}`}</p>
                </div>
                <span className="text-xs text-zinc-400 group-hover:text-indigo-500 transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
