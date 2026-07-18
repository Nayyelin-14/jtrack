"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  FileText,
  UserRound,
  Settings,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

const recruiterLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/companies", label: "Companies", icon: Building2 },
  { href: "/dashboard/jobs", label: "Jobs", icon: Briefcase },
  { href: "/dashboard/jobs/create", label: "Post a Job", icon: FileText },
];

const seekerLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/applications", label: "Applications", icon: FileText },
  { href: "/dashboard/skills", label: "Skills", icon: FileText },
  { href: "/dashboard/resume", label: "Resume", icon: FileText },
];

const commonLinks = [
  { href: "/dashboard/profile", label: "Profile", icon: UserRound },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isRecruiter = user?.role === "recruiter";

  const primaryLinks = isRecruiter ? recruiterLinks : seekerLinks;

  return (
    <aside className="w-60 shrink-0 border-r border-sidebar-border bg-sidebar hidden md:flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-0.5">
        {isRecruiter && (
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Recruiter
          </p>
        )}
        {primaryLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 border-l-2 px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "border-sidebar-primary font-semibold text-sidebar-foreground"
                  : "border-transparent text-sidebar-foreground/60 hover:border-sidebar-border hover:text-sidebar-foreground"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-sidebar-primary" : ""}`} />
              {link.label}
            </Link>
          );
        })}
        <p className="px-3 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          General
        </p>
        {commonLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 border-l-2 px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "border-sidebar-primary font-semibold text-sidebar-foreground"
                  : "border-transparent text-sidebar-foreground/60 hover:border-sidebar-border hover:text-sidebar-foreground"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-sidebar-primary" : ""}`} />
              {link.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
