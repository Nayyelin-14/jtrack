"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authApi } from "@/lib/auth";
import { GuestGuard } from "@/components/guest-guard";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { AuthShell } from "@/components/auth-shell";

const MAX_RESUME = 5 * 1024 * 1024;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "jobseeker" },
  });
  const role = watch("role");
  const password = watch("password") ?? "";

  const onFile = (f: File | null) => {
    if (!f) return setResume(null);
    if (f.type !== "application/pdf") {
      toast.error("Resume must be a PDF");
      return;
    }
    if (f.size > MAX_RESUME) {
      toast.error("Resume must be under 5MB");
      return;
    }
    setResume(f);
  };

  async function onSubmit(data: RegisterInput) {
    setLoading(true);
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("email", data.email);
    fd.append("password", data.password);
    fd.append("phone_number", data.phone_number);
    fd.append("role", data.role);
    if (data.role === "jobseeker" && resume) fd.append("file", resume);
    try {
      const res = await authApi.register(fd);
      toast.success(res.message || "Account created — please sign in.");
      router.push("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const strength = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  return (
    <GuestGuard>
      <AuthShell
        title="Create your account"
        subtitle="Start tracking in under a minute"
        maxWidth="max-w-lg"
        image={{
          src: "https://images.unsplash.com/photo-1751199199822-c61b8bb7101b?auto=format&fit=crop&w=1200&q=80",
          alt: "People working together on laptops at a café",
        }}
        footer={
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" placeholder="Maya Chen" autoComplete="name" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone_number">Phone</Label>
              <Input id="phone_number" type="tel" placeholder="+1 555 123 4567" autoComplete="tel" {...register("phone_number")} />
              {errors.phone_number && <p className="text-xs text-destructive">{errors.phone_number.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" autoComplete="new-password" {...register("password")} />
            {password && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { ok: strength.length, label: "8+ chars" },
                  { ok: strength.upper, label: "uppercase" },
                  { ok: strength.lower, label: "lowercase" },
                  { ok: strength.number, label: "number" },
                ].map((s) => (
                  <span
                    key={s.label}
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold transition ${
                      s.ok ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                ))}
              </div>
            )}
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>I am a</Label>
            <Select
              value={role}
              onValueChange={(v) =>
                setValue("role", v as "jobseeker" | "recruiter", { shouldValidate: true })
              }
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="jobseeker">Jobseeker — looking for opportunities</SelectItem>
                <SelectItem value="recruiter">Recruiter — hiring for companies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {role === "jobseeker" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-1.5"
            >
              <Label>Resume (optional, PDF, max 5MB)</Label>
              {resume ? (
                <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-3 py-2.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate text-sm">{resume.name}</span>
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => setResume(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 px-3 py-4 text-sm text-muted-foreground transition hover:bg-muted/40 hover:text-foreground">
                  <Upload className="h-4 w-4" />
                  Click to upload resume
                  <input type="file" accept="application/pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
                </label>
              )}
            </motion.div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account…</> : "Create account"}
          </Button>
        </form>
      </AuthShell>
    </GuestGuard>
  );
}
