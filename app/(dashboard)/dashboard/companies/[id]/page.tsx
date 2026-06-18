"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Building2, Globe, MapPin, ArrowLeft, Briefcase, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { companyApi } from "@/lib/companies";
import type { CompanyDetailResponse } from "@/types";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = Number(params.id);
  const user = useAuthStore((s) => s.user);
  const isRecruiter = user?.role === "recruiter";

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => companyApi.getDetail(companyId) as Promise<CompanyDetailResponse>,
    enabled: !!companyId,
  });

  async function handleDelete() {
    if (!confirm("Delete this company and all associated jobs? This cannot be undone.")) return;
    try {
      const res = await companyApi.remove(companyId) as { success: boolean; message: string };
      toast.success(res.message || "Company deleted");
      router.push("/dashboard/companies");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete company");
    }
  }

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
        <Button variant="outline" className="mt-4 rounded-lg" onClick={() => router.push("/dashboard/companies")}>Back to Companies</Button>
      </div>
    );
  }

  const company = data.company;

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        <span className="text-zinc-300 dark:text-zinc-600">|</span>
        <Link href="/dashboard/companies" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
          All Companies
        </Link>
      </div>

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
            <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1 flex-wrap">
              {company.industry && <span>{company.industry}</span>}
              {company.size && <><span>·</span><span>{company.size}</span></>}
              {company.location && <><span>·</span><span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{company.location}</span></>}
              {company.website && <><span>·</span><span className="inline-flex items-center gap-1"><Globe className="h-3 w-3" />{company.website}</span></>}
            </div>
          </div>
        </div>
        {isRecruiter && (
          <Button variant="destructive" size="sm" onClick={handleDelete} className="rounded-lg text-xs">
            <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
          </Button>
        )}
      </div>

      {company.description && (
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 mb-6 max-w-prose">{company.description}</p>
      )}

      {company.jobs && company.jobs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-3">Open Positions</h2>
          <div className="space-y-2">
            {company.jobs.map((job) => (
              <Link
                key={job.job_id}
                href={`/dashboard/jobs/${job.job_id}`}
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
  );
}
