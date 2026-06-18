"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft, User, CheckCircle, XCircle, Clock, FileText, Crown, AlertTriangle } from "lucide-react";
import { jobApi } from "@/lib/jobs";
import { applicationsApi } from "@/lib/applications";
import type { ApplicationsResponse } from "@/types";
import { Button } from "@/components/ui/button";

const statusConfig: Record<string, { label: string; class: string }> = {
  Submitted: { label: "Submitted", class: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  Applied: { label: "Applied", class: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
  Hired: { label: "Hired", class: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
  Rejected: { label: "Rejected", class: "bg-red-500/10 text-red-700 dark:text-red-400" },
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
    <>
      <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Job
      </button>

      <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Applications</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{data?.count ?? 0} total applications</p>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-2">
              <div className="h-4 w-36 bg-zinc-200 dark:bg-zinc-700 animate-pulse rounded" />
              <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-16">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Failed to load applications</p>
          <p className="text-xs text-zinc-500 mt-1">{error instanceof Error ? error.message : "Something went wrong"}</p>
        </div>
      )}

      {data && data.applications.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">No applications yet</p>
          <p className="text-xs text-zinc-500 mt-1">Candidates haven&apos;t applied to this job yet.</p>
        </div>
      )}

      {data && data.applications.length > 0 && (
        <>
          <p className="text-xs text-zinc-400 mb-3">Subscribed applicants shown first</p>
          <div className="space-y-3">
            {sortedApps.map((app) => {
              const cfg = statusConfig[app.status] || statusConfig.Submitted;
              const isTerminal = terminalStatuses.includes(app.status);
              return (
                <div key={app.application_id} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {app.profile_pic ? (
                        <img src={app.profile_pic} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700 shrink-0" />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/10 shrink-0">
                          <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate">
                            {app.name ?? `Applicant #${app.user_id}`}
                          </p>
                          {app.subscribed && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400">
                              <Crown className="h-2.5 w-2.5" /> Premium
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5 flex-wrap">
                          <span>{app.email ?? ""}</span>
                          {app.match_score !== undefined && (
                            <><span>·</span><span className="font-medium text-indigo-600 dark:text-indigo-400">{app.match_score}% match</span></>
                          )}
                          {app.resume && (
                            <><span>·</span><a href={app.resume} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400 hover:underline"><FileText className="h-3 w-3" />Resume</a></>
                          )}
                          <span>· Applied {new Date(app.applied_at).toLocaleDateString()}</span>
                        </div>
                        {app.bio && (
                          <p className="text-xs text-zinc-500 mt-1.5 line-clamp-2">{app.bio}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.class}`}>
                          {app.status === "Hired" ? <CheckCircle className="h-3 w-3" /> : app.status === "Rejected" ? <XCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {cfg.label}
                        </span>
                      </div>
                      {isTerminal ? (
                        <span className="text-[10px] text-zinc-400 italic">Final status — cannot be changed</span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <select
                            value={app.status}
                            onChange={(e) => {
                              if (e.target.value !== app.status) {
                                updateStatus.mutate({ applicationId: app.application_id, status: e.target.value });
                              }
                            }}
                            className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/15"
                            disabled={updateStatus.isPending}
                          >
                            <option value="Submitted">Submitted</option>
                            <option value="Applied">Applied</option>
                            <option value="Hired">Hired</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                          {updateStatus.variables?.applicationId === app.application_id && updateStatus.isPending && (
                            <Loader2 className="h-3 w-3 animate-spin text-zinc-400" />
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
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
