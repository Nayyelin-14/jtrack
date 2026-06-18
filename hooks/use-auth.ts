"use client";

import { useAuthStore } from "@/store/auth-store";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const logout = useAuthStore((s) => s.logout);

  return {
    user,
    isLoading,
    isInitialized,
    logout,
    isAuthenticated: !!user,
    isRecruiter: user?.role === "recruiter",
    isJobseeker: user?.role === "jobseeker",
  };
}
