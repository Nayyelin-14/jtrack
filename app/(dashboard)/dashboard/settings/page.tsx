"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Lock, ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { authApi } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.changePassword(currentPassword, newPassword);
      toast.success(res.message || "Password changed");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
      </Link>
      <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Settings</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Update your password and account preferences.</p>

      <div className="max-w-md space-y-6">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10">
                <Lock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Change Password</h2>
                <p className="text-xs text-zinc-500">Use at least 6 characters</p>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-3 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-300">You will be logged out on all devices after changing your password.</p>
            </div>
            <form onSubmit={onSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm">Confirm new password</Label>
              <Input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="rounded-lg" />
            </div>
            <Button type="submit" disabled={loading} className="rounded-lg w-full">
              {loading && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              Change Password
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
