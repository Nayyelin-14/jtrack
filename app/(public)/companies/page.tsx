"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { companyApi } from "@/lib/companies";
import type { CompanyListResponse } from "@/types";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function PublicCompaniesPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["public-companies"],
    queryFn: () => companyApi.list() as Promise<CompanyListResponse>,
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <h1 className="font-display text-2xl font-bold tracking-tight mb-1">Companies</h1>
        <p className="text-sm text-muted-foreground mb-6">Browse registered companies.</p>

        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-border p-5 space-y-3">
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-3 w-full bg-muted/60 animate-pulse rounded" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-16">
            <p className="text-sm font-medium text-foreground">Failed to load companies</p>
            <p className="text-xs text-muted-foreground mt-1">{error instanceof Error ? error.message : "Something went wrong"}</p>
          </div>
        )}

        {data && data.companies.length === 0 && (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No companies yet</p>
          </div>
        )}

        {data && data.companies.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.companies.map((company) => (
              <Link
                key={company.company_id}
                href={`/companies/${company.company_id}`}
                className="rounded-lg border border-border bg-card p-5 hover:border-primary/40 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  {company.logo ? (
                    <img src={company.logo} alt="" className="h-10 w-10 rounded-xl object-contain bg-background" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                      {company.name}
                    </h3>
                    {company.industry && (
                      <p className="text-xs text-muted-foreground">{company.industry}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {company.location && <span>{company.location}</span>}
                  {company.size && <><span>·</span><span>{company.size}</span></>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
