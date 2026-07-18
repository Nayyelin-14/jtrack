"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { jobApi } from "@/lib/jobs";
import { companyApi } from "@/lib/companies";
import { useQuery } from "@tanstack/react-query";
import type { MyCompaniesResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      router.push("/dashboard/jobs");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to post job");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>

      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Post a Job</h1>
        <p className="text-xs text-muted-foreground">Create a new job listing.</p>
      </div>

      <Card className="max-w-xl">
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Select
                value={form.company_id}
                onValueChange={(v) => setForm({ ...form, company_id: v })}
              >
                <SelectTrigger id="company"><SelectValue placeholder="Select a company" /></SelectTrigger>
                <SelectContent>
                  {companiesData?.companies.map((c) => (
                    <SelectItem key={c.company_id} value={String(c.company_id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Job title *</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Senior Software Engineer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Input id="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Full-stack developer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description *</Label>
              <Textarea
                id="desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={5}
                className="resize-none"
                placeholder="Describe the role..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="New York" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="openings">Openings</Label>
                <Input id="openings" type="number" min="1" max="999" value={form.openings} onChange={(e) => setForm({ ...form, openings: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job_type">Job type</Label>
                <Select value={form.job_type} onValueChange={(v) => setForm({ ...form, job_type: v })}>
                  <SelectTrigger id="job_type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Full-time", "Part-time", "Contract", "Internship"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="work_location">Work location</Label>
                <Select value={form.work_location} onValueChange={(v) => setForm({ ...form, work_location: v })}>
                  <SelectTrigger id="work_location"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Remote", "On-site", "Hybrid"].map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salary (optional)</Label>
              <Input id="salary" type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="100000" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                Post Job
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
