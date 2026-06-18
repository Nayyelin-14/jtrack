"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Briefcase, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/auth";
import { useAuthStore } from "@/store/auth-store";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { GuestGuard } from "@/components/guest-guard";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setLoading(true);
    try {
      const res = await authApi.login(data.email, data.password);
      useAuthStore.getState().setUser(res.user ?? null, res.token ?? null);
      toast.success(res.message || "Welcome back!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <GuestGuard>
      <div className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-12">
        <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <Link href="/" className="absolute left-6 top-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass w-full max-w-md rounded-3xl p-8 shadow-glow"
        >
          <Link href="/" className="mb-6 flex items-center justify-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl shadow-elegant text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
              <Briefcase className="h-4 w-4" />
            </span>
            <span className="text-lg font-bold">J-<span className="gradient-text">Track</span></span>
          </Link>
          <h1 className="text-center text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">Sign in to continue your journey</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" placeholder="••••••••" autoComplete="current-password" {...register("password")} />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <Button type="submit" disabled={loading} className="w-full shadow-elegant text-primary-foreground" style={{ background: "var(--gradient-cta)" }}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…</> : "Sign in"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">Create one</Link>
          </p>
        </motion.div>
      </div>
    </GuestGuard>
  );
}
