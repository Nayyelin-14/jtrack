"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, ArrowLeft, User, CheckCircle, XCircle, Clock, FileText, Crown, AlertTriangle } from "lucide-react";
import { jobApi } from "@/lib/jobs";
import { applicationsApi } from "@/lib/applications";
import type { ApplicationsResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  Submitted: { label: "Submitted", variant: "secondary" },
  Applied: { label: "Applied", variant: "default" },
  Hired: { label: "Hired", variant: "outline" },
  Rejected: { label: "Rejected", variant: "destructive" },
};

const terminalStatuses = ["Hired", "Rejected"];

export default function JobApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const jobId = Number(params.id);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["job-applications", jobId],
    queryFn: () => jobApi.applicationsByJob(jobId) as Promise<ApplicationsResponse>,
    enabled: !!jobId,
  });

  const updateStatus = useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: number; status: string }) =>
      applicationsApi.updateStatus(applicationId, status),
    onSuccess: (res, vars) => {
      toast.success(res.message || `Status updated to ${vars.status}`);
      queryClient.invalidateQueries({ queryKey: ["job-applications", jobId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const sortedApps = data?.applications
    ? [...data.applications].sort((a, b) => {
        if (a.subscribed && !b.subscribed) return -1;
        if (!a.subscribed && b.subscribed) return 1;
        return new Date(a.applied_at).getTime() - new Date(b.applied_at).getTime();
      })
    : [];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Job
      </button>

      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
          <p className="text-xs text-muted-foreground">{data?.count ?? 0} total applications</p>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/60 p-4 space-y-2 animate-pulse">
              <div className="h-4 w-36 bg-muted rounded" />
              <div className="h-3 w-full bg-muted rounded" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <Card className="border-destructive/30">
          <CardContent className="grid place-items-center py-16 text-center">
            <p className="text-sm font-medium text-foreground">Failed to load applications</p>
            <p className="text-xs text-muted-foreground mt-1">{error instanceof Error ? error.message : "Something went wrong"}</p>
          </CardContent>
        </Card>
      )}

      {data && data.applications.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="grid place-items-center py-16 text-center">
            <User className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="font-semibold">No applications yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Candidates haven&apos;t applied to this job yet.</p>
          </CardContent>
        </Card>
      )}

      {data && data.applications.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">Subscribed applicants shown first</p>
          {sortedApps.map((app, i) => {
            const cfg = statusConfig[app.status] || statusConfig.Submitted;
            const isTerminal = terminalStatuses.includes(app.status);
            return (
              <motion.div
                key={app.application_id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 10) * 0.03 }}
              >
                <Card className="transition-all hover:shadow-elegant">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={app.profile_pic ?? undefined} />
                          <AvatarFallback>
                            {app.name?.charAt(0).toUpperCase() ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {app.name ?? `Applicant #${app.user_id}`}
                            </p>
                            {app.subscribed && (
                              <Badge variant="secondary" className="gap-0.5 text-[10px]">
                                <Crown className="h-2.5 w-2.5" /> Premium
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 flex-wrap">
                            <span>{app.email ?? ""}</span>
                            {app.match_score !== undefined && (
                              <><span>·</span><span className="font-medium text-primary">{app.match_score}% match</span></>
                            )}
                            {app.resume && (
                              <><span>·</span><a href={app.resume} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-primary hover:underline"><FileText className="h-3 w-3" />Resume</a></>
                            )}
                            <span>· Applied {new Date(app.applied_at).toLocaleDateString()}</span>
                          </div>
                          {app.bio && (
                            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{app.bio}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge variant={cfg.variant} className="capitalize gap-1">
                          {app.status === "Hired" ? <CheckCircle className="h-3 w-3" /> : app.status === "Rejected" ? <XCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {cfg.label}
                        </Badge>
                        {isTerminal ? (
                          <span className="text-[10px] text-muted-foreground italic">Final status</span>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Select
                              value={app.status}
                              onValueChange={(v) => {
                                if (v !== app.status) {
                                  updateStatus.mutate({ applicationId: app.application_id, status: v });
                                }
                              }}
                            >
                              <SelectTrigger className="h-7 text-xs w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Submitted">Submitted</SelectItem>
                                <SelectItem value="Applied">Applied</SelectItem>
                                <SelectItem value="Hired">Hired</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                            {updateStatus.variables?.applicationId === app.application_id && updateStatus.isPending && (
                              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                            )}
                          </div>
                        )}
                        {!isTerminal && app.status !== "Submitted" && app.status !== "Applied" && (
                          <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                            <AlertTriangle className="h-2.5 w-2.5" /> Email notification will be sent
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
