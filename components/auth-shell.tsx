"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function AuthShell({ title, subtitle, children, footer }: {
  title: string; subtitle?: string; children: ReactNode; footer?: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span
            className="grid h-8 w-8 place-items-center rounded-lg shadow-elegant text-primary-foreground"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Briefcase className="h-4 w-4" />
          </span>
          <span className="text-lg font-bold">J-<span className="gradient-text">Track</span></span>
        </Link>
        <ThemeToggle />
      </header>
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto flex w-full max-w-md flex-col px-6 pb-16 pt-6"
      >
        <div className="glass mb-8 w-full rounded-3xl p-8 shadow-glow">
          <Link href="/" className="mb-6 flex items-center justify-center gap-2">
            <span
              className="grid h-9 w-9 place-items-center rounded-xl shadow-elegant text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Briefcase className="h-4 w-4" />
            </span>
            <span className="text-lg font-bold">J-<span className="gradient-text">Track</span></span>
          </Link>
          <h1 className="text-center text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-center text-sm text-muted-foreground">{subtitle}</p>
          )}
          <div className="mt-6">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </motion.main>
    </div>
  );
}
