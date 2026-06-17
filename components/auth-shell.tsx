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
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10"
        style={{ backgroundImage: "radial-gradient(55% 45% at 18% 5%, oklch(0.88 0.07 256 / 0.55), transparent 60%), radial-gradient(40% 40% at 95% 85%, oklch(0.92 0.06 60 / 0.4), transparent 60%)" }} />
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Briefcase className="h-4 w-4" /></span>
          <span className="text-lg">J-Track</span>
        </Link>
        <ThemeToggle />
      </header>
      <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex w-full max-w-md flex-col px-6 pb-16 pt-6">
        <div className="mb-6 text-center">
          <h1 className="text-3xl tracking-tight text-foreground" style={{ fontFamily: "'Fraunces', ui-serif, Georgia, serif", fontStyle: "italic" }}>{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {children}
        {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
      </motion.main>
    </div>
  );
}