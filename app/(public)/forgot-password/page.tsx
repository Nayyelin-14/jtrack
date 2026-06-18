"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/auth";
import { GuestGuard } from "@/components/guest-guard";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordInput) {
    setLoading(true);
    try {
      await authApi.forgotPassword(data.email);
    } catch {
      /* always show success per spec */
    } finally {
      setLoading(false);
      setSent(true);
    }
  }

  return (
    <GuestGuard>
      <div className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-12">
        <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <Link href="/login" className="absolute left-6 top-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass w-full max-w-md rounded-3xl p-8 shadow-glow"
        >
          {sent ? (
            <div className="text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/15">
                <CheckCircle2 className="h-7 w-7 text-success" />
              </div>
              <h1 className="mt-5 text-2xl font-bold tracking-tight">Check your email</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                If an account exists for that email, we've sent a password reset link. The link expires in 1 hour.
              </p>
              <Button asChild className="mt-6 w-full">
                <Link href="/login">Back to sign in</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                <Mail className="h-7 w-7" />
              </div>
              <h1 className="mt-5 text-center text-2xl font-bold tracking-tight">Reset your password</h1>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Enter the email tied to your account and we'll send you a reset link.
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register("email")} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <Button type="submit" disabled={loading} className="w-full shadow-elegant text-primary-foreground" style={{ background: "var(--gradient-cta)" }}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</> : "Send reset link"}
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </GuestGuard>
  );
}
