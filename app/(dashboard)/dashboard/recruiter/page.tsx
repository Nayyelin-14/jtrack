"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Building2, Briefcase, Plus, ArrowRight, Users, Sparkles } from "lucide-react";
import { jobApi } from "@/lib/jobs";
import type { MyJobsResponse } from "@/types";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RecruiterDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data } = useQuery({
    queryKey: ["my-jobs"],
    queryFn: () => jobApi.myJobs() as Promise<MyJobsResponse>,
    staleTime: 30_000,
  });

  const totalApps = data?.jobs.reduce((sum, j) => sum + j.total_applications, 0) ?? 0;
  const activeJobs = data?.jobs.filter((j) => j.is_active).length ?? 0;

  const greeting =
    new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold tracking-tight">{greeting}, {user?.name.split(" ")[0]} 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your companies and job postings.</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { href: "/dashboard/companies", icon: Building2, label: "Companies", desc: "Manage companies", color: "from-indigo-500/20 to-indigo-600/10", iconColor: "text-indigo-600 dark:text-indigo-400" },
          { href: "/dashboard/jobs/create", icon: Plus, label: "Post a Job", desc: "Create listing", color: "from-emerald-500/20 to-emerald-600/10", iconColor: "text-emerald-600 dark:text-emerald-400" },
          { href: "/dashboard/jobs", icon: Briefcase, label: `${data?.jobs.length ?? 0} Job Listings`, desc: `${totalApps} total applicants`, color: "from-amber-500/20 to-amber-600/10", iconColor: "text-amber-600 dark:text-amber-400" },
        ].map((item, i) => (
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
                    <div>
                      <div className={`grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br ${item.color} mb-3`}>
                        <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                      </div>
                      <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                      <p className="text-sm font-semibold text-foreground">{item.desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="glass">
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold">{activeJobs} active jobs</p>
                <p className="text-xs text-muted-foreground">{totalApps} total candidates</p>
              </div>
            </div>
            <Button asChild size="sm" variant="outline" className="gap-1.5">
              <Link href="/dashboard/jobs">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/15">
                <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold">AI Match Analysis</p>
                <p className="text-xs text-muted-foreground">Find the best candidates</p>
              </div>
            </div>
            <Badge variant="secondary">Coming soon</Badge>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
