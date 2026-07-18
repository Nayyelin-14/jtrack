"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/auth";
import { GuestGuard } from "@/components/guest-guard";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations";
import { AuthShell } from "@/components/auth-shell";

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
      <AuthShell
        backHref="/login"
        backLabel="Back to sign in"
        icon={sent ? CheckCircle2 : Mail}
        tone={sent ? "success" : "primary"}
        title={sent ? "Check your email" : "Reset your password"}
        subtitle={
          sent
            ? undefined
            : "Enter the email tied to your account and we'll send you a reset link."
        }
      >
        {sent ? (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              If an account exists for that email, we've sent a password reset link. The link expires in 1 hour.
            </p>
            <Button asChild className="mt-6 w-full">
              <Link href="/login">Back to sign in</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</> : "Send reset link"}
            </Button>
          </form>
        )}
      </AuthShell>
    </GuestGuard>
  );
}
