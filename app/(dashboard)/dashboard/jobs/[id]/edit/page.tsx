"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { jobApi } from "@/lib/jobs";
import type { JobDetailResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = Number(params.id);
  const [form, setForm] = useState({
    title: "",
    description: "",
    role: "",
    location: "",
    job_type: "Full-time",
    work_location: "Remote",
    openings: "1",
    salary: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => jobApi.jobDetail(jobId) as Promise<JobDetailResponse>,
    enabled: !!jobId,
  });

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
      </div>
      <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Edit Job</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Update this job listing.</p>
      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-zinc-400" /></div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); toast.info("Job update API not yet implemented"); }} className="max-w-xl space-y-4">
          <Button type="submit" disabled={submitting} className="rounded-lg">
            {submitting && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      )}
    </>
  );
}
