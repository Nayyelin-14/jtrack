"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Plus, Building2, Loader2, MapPin } from "lucide-react";
import { companyApi } from "@/lib/companies";
import type { MyCompaniesResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyCompaniesPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-companies"],
    queryFn: () => companyApi.myCompanies() as Promise<MyCompaniesResponse>,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">My Companies</h1>
          <p className="text-xs text-muted-foreground">Companies you manage.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/companies/new">
            <Plus className="h-4 w-4" /> New Company
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isError && (
        <Card className="border-destructive/30">
          <CardContent className="grid place-items-center py-16 text-center">
            <p className="text-sm font-medium text-foreground">Failed to load companies</p>
            <p className="text-xs text-muted-foreground mt-1">{error instanceof Error ? error.message : "Something went wrong"}</p>
          </CardContent>
        </Card>
      )}

      {data && data.companies.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="grid place-items-center py-16 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-lg bg-primary/10 mb-4">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">No companies yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">Create your first company.</p>
            <Button asChild className="mt-5 gap-2">
              <Link href="/dashboard/companies/new"><Plus className="h-4 w-4" /> Create Company</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {data && data.companies.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.companies.map((company) => (
            <div key={company.company_id}>
              <Link href={`/dashboard/companies/${company.company_id}`} className="block group">
                <Card className="transition-all hover:shadow-sm hover:-translate-y-0.5">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      {company.logo ? (
                        <img src={company.logo} alt="" className="h-10 w-10 rounded-xl object-contain bg-background" />
                      ) : (
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                          {company.name}
                        </h3>
                        {company.industry && (
                          <p className="text-xs text-muted-foreground">{company.industry}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                      {company.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{company.location}</span>}
                      {company.size && <><span>·</span><span>{company.size}</span></>}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
