"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  icon: Icon,
  tone = "primary",
  backHref = "/",
  backLabel = "Back home",
  maxWidth = "max-w-md",
  image,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  icon?: LucideIcon;
  tone?: "primary" | "success";
  backHref?: string;
  backLabel?: string;
  maxWidth?: string;
  image?: { src: string; alt: string };
}) {
  const form = (
    <div className={`relative w-full ${maxWidth}`}>
      {Icon ? (
        tone === "success" ? (
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-md bg-success/15">
            <Icon className="h-7 w-7 text-success" />
          </div>
        ) : (
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-md bg-primary text-primary-foreground">
            <Icon className="h-7 w-7" />
          </div>
        )
      ) : (
        <Link href="/" className="mb-2 flex items-center justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="font-display text-lg font-semibold">J-Track</span>
        </Link>
      )}
      <h1 className="mt-5 text-center font-display text-2xl font-semibold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-2 text-center text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-6">{children}</div>
      {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
    </div>
  );

  if (image) {
    return (
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative flex flex-col justify-between px-6 py-6 sm:px-10 sm:py-8">
          <div className="flex items-center justify-between">
            <Link href={backHref} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> {backLabel}
            </Link>
            <ThemeToggle />
          </div>
          <div className="grid flex-1 place-items-center py-8">{form}</div>
          <div />
        </div>
        <div className="relative hidden lg:block">
          <Image src={image.src} alt={image.alt} fill sizes="50vw" className="object-cover" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative grid min-h-screen place-items-center px-4 py-12">
      <div className="absolute left-6 top-6 flex items-center gap-4">
        <Link href={backHref} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {backLabel}
        </Link>
      </div>
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>
      <div className="rounded-lg border border-border bg-card p-8">{form}</div>
    </div>
  );
}
