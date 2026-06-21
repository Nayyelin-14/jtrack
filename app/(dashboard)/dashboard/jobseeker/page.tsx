"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Briefcase, FileText, UserRound, ArrowRight, Sparkles } from "lucide-react";
import { jobApi } from "@/lib/jobs";
import type { ApplicationsResponse } from "@/types";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const quickLinks = [
  {
    href: "/jobs",
    icon: Briefcase,
    title: "Browse Jobs",
    desc: (count: number) => `${count} applications submitted`,
    color: "from-indigo-500/20 to-indigo-600/10",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    href: "/dashboard/applications",
    icon: FileText,
    title: "Applications",
    desc: () => "View your submitted applications",
    color: "from-emerald-500/20 to-emerald-600/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    href: "/dashboard/skills",
    icon: UserRound,
    title: "Skills",
    desc: () => "Manage your skills",
    color: "from-amber-500/20 to-amber-600/10",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
];

export default function JobseekerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data } = useQuery({
    queryKey: ["my-applications"],
    queryFn: () => jobApi.myApplications() as Promise<ApplicationsResponse>,
    staleTime: 30_000,
  });

  const greeting =
    new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold tracking-tight">{greeting}, {user?.name.split(" ")[0]} 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track your job applications and find new opportunities.</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((item, i) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Link href={item.href} className="block group">
              <Card className="transition-all hover:shadow-elegant hover:-translate-y-0.5">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br ${item.color}`}>
                        <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc(data?.count ?? 0)}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <Card className="glass">
        <CardContent className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold">AI Career Guidance</p>
              <p className="text-xs text-muted-foreground">Get personalized career advice powered by AI.</p>
            </div>
          </div>
          <Button asChild size="sm" className="gap-1.5">
            <Link href="/ai/career-guidance">Try it <ArrowRight className="h-3.5 w-3.5" /></Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
