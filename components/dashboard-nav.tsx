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
    <aside className="w-56 shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 hidden md:flex flex-col">
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {isRecruiter && (
          <div className="px-3 py-2 mb-1">
            <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Recruiter
            </p>
          </div>
        )}
        {primaryLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
        <div className="px-3 py-2 mt-4 mb-1">
          <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            General
          </p>
        </div>
        {commonLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
