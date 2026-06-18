import Link from "next/link";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import type { Application } from "@/types";
import { Button } from "@/components/ui/button";

const statusStyles: Record<string, string> = {
  Submitted: "bg-amber-500/10 text-amber-600",
  Rejected: "bg-destructive/10 text-destructive",
  Hired: "bg-emerald-500/10 text-emerald-600",
};

export function ApplicationCard({ application }: { application: Application }) {
  const statusClass = statusStyles[application.status] || "bg-muted text-muted-foreground";

  return (
    <div className="rounded-xl border border-border/60 bg-card/70 p-5 backdrop-blur transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {application.company_logo && (
              <img src={application.company_logo} alt="" className="h-5 w-5 rounded object-contain" />
            )}
            <span className="text-xs font-medium text-muted-foreground">{application.company_name}</span>
          </div>
          <h3 className="mt-1.5 text-base font-semibold tracking-tight text-foreground">
            {application.job_title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {application.job_location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {application.job_location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> Applied{" "}
              {new Date(application.applied_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusClass}`}>
          {application.status}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-end border-t border-border/40 pt-3">
        <Button asChild size="sm" variant="ghost" className="group/btn">
          <Link href={`/jobs/${application.job_id}`}>
            View job <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
