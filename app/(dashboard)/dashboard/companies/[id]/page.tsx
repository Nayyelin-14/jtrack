"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Building2, Globe, MapPin, ArrowLeft, Briefcase, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { companyApi } from "@/lib/companies";
import type { CompanyDetailResponse } from "@/types";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
      <div className="grid h-64 place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data?.company) {
    return (
      <Card className="border-destructive/30">
        <CardContent className="grid place-items-center py-16 text-center">
          <p className="text-sm font-medium text-foreground">Company not found</p>
          <p className="text-xs text-muted-foreground mt-1">{error instanceof Error ? error.message : "Could not load company"}</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard/companies")}>Back to Companies</Button>
        </CardContent>
      </Card>
    );
  }

  const company = data.company;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        <span className="text-border">|</span>
        <Link href="/dashboard/companies" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          All Companies
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {company.logo ? (
            <img src={company.logo} alt="" className="h-14 w-14 rounded-xl object-contain bg-background ring-1 ring-border" />
          ) : (
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold tracking-tight">{company.name}</h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
              {company.industry && <span>{company.industry}</span>}
              {company.size && <><span>·</span><span>{company.size}</span></>}
              {company.location && <><span>·</span><span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{company.location}</span></>}
              {company.website && <><span>·</span><span className="inline-flex items-center gap-1"><Globe className="h-3 w-3" />{company.website}</span></>}
            </div>
          </div>
        </div>
        {isRecruiter && (
          <Button variant="destructive" size="sm" onClick={handleDelete} className="gap-1.5">
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        )}
      </div>

      {company.description && (
        <p className="text-sm leading-relaxed text-muted-foreground max-w-prose">{company.description}</p>
      )}

      {company.jobs && company.jobs.length > 0 && (
        <div>
          <h2 className="text-base font-semibold mb-3">Open Positions</h2>
          <div className="space-y-2">
            {company.jobs.map((job) => (
              <Link
                key={job.job_id}
                href={`/dashboard/jobs/${job.job_id}`}
                className="flex items-center justify-between rounded-xl border border-border/60 p-4 hover:border-primary/40 hover:shadow-elegant transition-all group"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{job.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{job.location} {(job.salary != null) && `· $${job.salary.toLocaleString()}`}</p>
                </div>
                <Briefcase className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
