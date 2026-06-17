"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { jobApi } from "@/lib/job-api";
import { companyApi } from "@/lib/company-api";
import { useQuery } from "@tanstack/react-query";
import type { MyCompaniesResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { data: companiesData } = useQuery({
    queryKey: ["my-companies"],
    queryFn: () => companyApi.myCompanies() as Promise<MyCompaniesResponse>,
  });

  const [form, setForm] = useState({
    company_id: "",
    title: "",
    description: "",
    role: "",
    location: "",
    job_type: "Full-time",
    work_location: "Remote",
    openings: "1",
    salary: "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company_id || !form.title.trim() || !form.description.trim() || !form.role.trim() || !form.location.trim()) {
      toast.error("Company, title, description, role, and location are required");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        company_id: Number(form.company_id),
        title: form.title,
        description: form.description,
        role: form.role,
        location: form.location,
        job_type: form.job_type,
        work_location: form.work_location,
        openings: Number(form.openings),
        salary: form.salary ? Number(form.salary) : undefined,
      };
      const res = await jobApi.create(payload) as { success: boolean; message: string };
      toast.success(res.message || "Job posted");
      router.push("/manage/jobs");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to post job");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Post a Job</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Create a new job listing.</p>

      <form onSubmit={onSubmit} className="max-w-xl space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company">Company *</Label>
          <select
            id="company"
            value={form.company_id}
            onChange={(e) => setForm({ ...form, company_id: e.target.value })}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-400"
          >
            <option value="">Select a company</option>
            {companiesData?.companies.map((c) => (
              <option key={c.company_id} value={c.company_id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Job title *</Label>
          <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Senior Software Engineer" className="rounded-lg" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role *</Label>
          <Input id="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Full-stack developer" className="rounded-lg" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="desc">Description *</Label>
          <textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-400" placeholder="Describe the role..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="New York" className="rounded-lg" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="openings">Openings</Label>
            <Input id="openings" type="number" min="1" max="999" value={form.openings} onChange={(e) => setForm({ ...form, openings: e.target.value })} className="rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="job_type">Job type</Label>
            <select id="job_type" value={form.job_type} onChange={(e) => setForm({ ...form, job_type: e.target.value })} className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-400">
              {["Full-time", "Part-time", "Contract", "Internship"].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="work_location">Work location</Label>
            <select id="work_location" value={form.work_location} onChange={(e) => setForm({ ...form, work_location: e.target.value })} className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-400">
              {["Remote", "On-site", "Hybrid"].map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="salary">Salary (optional)</Label>
          <Input id="salary" type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="100000" className="rounded-lg" />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="rounded-lg">
            {loading && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
            Post Job
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-lg">Cancel</Button>
        </div>
      </form>
    </>
  );
}
