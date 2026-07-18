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
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="space-y-6">
      <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>

      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Edit Job</h1>
        <p className="text-xs text-muted-foreground">Update this job listing.</p>
      </div>

      {isLoading ? (
        <div className="grid h-64 place-items-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <Card className="max-w-xl">
          <CardContent className="p-6">
            <form onSubmit={(e) => { e.preventDefault(); toast.info("Job update API not yet implemented"); }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job title</Label>
                <Input id="title" value={data?.job?.title ?? ""} disabled />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
