"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Plus, Building2, Loader2 } from "lucide-react";
import { companyApi } from "@/lib/company-api";
import type { CompanyListResponse, MyCompaniesResponse } from "@/lib/types";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";

export default function CompaniesPage() {
  const user = useAuthStore((s) => s.user);
  const isRecruiter = user?.role === "recruiter";
  const { data, isLoading, isError, error } = useQuery({
    queryKey: isRecruiter ? ["my-companies"] : ["companies"],
    queryFn: () =>
      isRecruiter
        ? companyApi.myCompanies() as Promise<MyCompaniesResponse>
        : companyApi.list() as Promise<CompanyListResponse>,
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Companies</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{isRecruiter ? "Manage your registered companies." : "Browse registered companies."}</p>
        </div>
        {isRecruiter && (
          <Button asChild className="rounded-lg">
            <Link href="/companies/create">
              <Plus className="mr-1.5 h-4 w-4" /> New Company
            </Link>
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-3">
              <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 animate-pulse rounded" />
              <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
              <div className="h-3 w-2/3 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-16">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Failed to load companies</p>
          <p className="text-xs text-zinc-500 mt-1">{error instanceof Error ? error.message : "Something went wrong"}</p>
        </div>
      )}

      {data && data.companies.length === 0 && (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3">
            <Building2 className="h-6 w-6 text-zinc-400" />
          </div>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">No companies yet</p>
          <p className="text-xs text-zinc-500 mt-1">{isRecruiter ? "Create your first company to start posting jobs." : "No companies registered yet."}</p>
          {isRecruiter && (
            <Button asChild className="mt-4 rounded-lg">
              <Link href="/companies/create">Create Company</Link>
            </Button>
          )}
        </div>
      )}

      {data && data.companies.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.companies.map((company) => (
            <Link
              key={company.company_id}
              href={`/companies/${company.company_id}`}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                {company.logo ? (
                  <img src={company.logo} alt="" className="h-10 w-10 rounded-lg object-contain bg-white" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                    <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm text-zinc-800 dark:text-zinc-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {company.name}
                  </h3>
                  {company.industry && (
                    <p className="text-xs text-zinc-500">{company.industry}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                {company.location && <span>{company.location}</span>}
                {company.size && <><span>·</span><span>{company.size}</span></>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
