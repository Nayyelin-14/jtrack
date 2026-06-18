"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Building2, Globe, MapPin, ArrowLeft, Briefcase } from "lucide-react";
import { companyApi } from "@/lib/companies";
import type { CompanyDetailResponse } from "@/types";
import { SiteHeader } from "@/components/site-header";

export default function PublicCompanyDetailPage() {
  const params = useParams();
  const companyId = Number(params.id);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["public-company", companyId],
    queryFn: () => companyApi.getDetail(companyId) as Promise<CompanyDetailResponse>,
    enabled: !!companyId,
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        {isLoading && (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-zinc-400" /></div>
        )}

        {isError && (
          <div className="text-center py-16">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Company not found</p>
            <p className="text-xs text-zinc-500 mt-1">{error instanceof Error ? error.message : "Could not load company"}</p>
          </div>
        )}

        {data?.company && (
          <>
            <Link href="/companies" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-4">
              <ArrowLeft className="h-3.5 w-3.5" /> All Companies
            </Link>
            <div className="flex items-center gap-4 mb-6">
              {data.company.logo ? (
                <img src={data.company.logo} alt="" className="h-14 w-14 rounded-xl object-contain bg-white ring-1 ring-zinc-200 dark:ring-zinc-700" />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
                  <Building2 className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">{data.company.name}</h1>
                <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                  {data.company.industry && <span>{data.company.industry}</span>}
                  {data.company.size && <><span>·</span><span>{data.company.size}</span></>}
                  {data.company.location && <><span>·</span><span>{data.company.location}</span></>}
                </div>
              </div>
            </div>

            {data.company.description && (
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 mb-6">{data.company.description}</p>
            )}

            {data.company.jobs && data.company.jobs.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-3">Open Positions</h2>
                <div className="space-y-2">
                  {data.company.jobs.map((job) => (
                    <Link
                      key={job.job_id}
                      href={`/jobs/${job.job_id}`}
                      className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group"
                    >
                      <div>
                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{job.title}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{job.location} {(job.salary != null) && `· $${job.salary.toLocaleString()}`}</p>
                      </div>
                      <Briefcase className="h-4 w-4 text-zinc-400" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
