"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Building2, ArrowLeft } from "lucide-react";
import { companyApi } from "@/lib/companies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateCompanyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    website: "",
    size: "",
    industry: "",
    location: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Company name is required");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      if (form.description) fd.append("description", form.description);
      if (form.website) fd.append("website", form.website);
      if (form.size) fd.append("size", form.size);
      if (form.industry) fd.append("industry", form.industry);
      if (form.location) fd.append("location", form.location);
      if (logo) fd.append("logo", logo);

      const res = await companyApi.create(fd) as { success: boolean; message: string; company: any };
      toast.success(res.message || "Company created");
      router.push("/dashboard/companies");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create company");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>

      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
          <Building2 className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Company</h1>
          <p className="text-xs text-muted-foreground">Register a new company.</p>
        </div>
      </div>

      <Card className="max-w-xl">
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company name *</Label>
              <Input id="name" value={form.name} onChange={handleChange} placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring resize-none"
                placeholder="Tell us about your company..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" value={form.website} onChange={handleChange} placeholder="https://acme.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" value={form.industry} onChange={handleChange} placeholder="Technology" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="size">Company size</Label>
                <select
                  id="size"
                  value={form.size}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring"
                >
                  <option value="">Select size</option>
                  {["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"].map((s) => (
                    <option key={s} value={s}>{s} employees</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={form.location} onChange={handleChange} placeholder="San Francisco" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo</Label>
              <Input id="logo" type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] ?? null)} className="text-sm" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                Create Company
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
