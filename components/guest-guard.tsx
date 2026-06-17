"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function GuestGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    if (isInitialized && user) {
      router.replace("/jobs");
    }
  }, [isInitialized, user, router]);

  if (!isInitialized) return null;

  if (user) return null;

  return <>{children}</>;
}
