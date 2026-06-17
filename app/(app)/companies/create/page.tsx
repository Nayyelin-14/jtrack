"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { companyApi } from "@/lib/company-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateCompanyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [form, setForm] = useState({ name: "", description: "", website: "", size: "", industry: "", location: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Company name is required"); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("website", form.website);
      fd.append("size", form.size);
      fd.append("industry", form.industry);
      fd.append("location", form.location);
      if (logo) fd.append("logo", logo);
      const res = await companyApi.create(fd);
      toast.success(res.message || "Company created");
      router.push("/companies");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create company");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Create Company</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Register your company to start posting jobs.</p>

      <form onSubmit={onSubmit} className="max-w-xl space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Company name *</Label>
          <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Acme Inc." className="rounded-lg" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="desc">Description</Label>
          <textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-400" placeholder="Tell us about your company..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://acme.com" className="rounded-lg" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="size">Size</Label>
            <Input id="size" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="10-50 employees" className="rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input id="industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="Technology" className="rounded-lg" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="San Francisco, CA" className="rounded-lg" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Logo</Label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors">
              <Upload className="h-4 w-4" />
              {logo ? logo.name : "Upload logo"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setLogo(e.target.files?.[0] ?? null)} />
            </label>
            {logo && (
              <button onClick={() => setLogo(null)} className="text-zinc-400 hover:text-red-500 transition-colors">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="rounded-lg">
            {loading && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
            Create Company
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-lg">
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
}
