"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      router.replace(`/reset-password/${encodeURIComponent(token)}`);
    } else {
      router.replace("/forgot-password");
    }
  }, [token, router]);

  return null;
}
