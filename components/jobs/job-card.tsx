import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import type { Job } from "@/lib/types";
import { Button } from "@/components/ui/button";

export function JobCard({ job }: { job: Job }) {
  return (
    <div className="group rounded-xl border border-border/60 bg-card/70 p-5 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {job.company_logo && (
              <img src={job.company_logo} alt="" className="h-6 w-6 rounded object-contain" />
            )}
            <span className="text-xs font-medium text-muted-foreground">{job.company_name}</span>
          </div>
          <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-foreground">
            {job.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {job.location}
            </span>
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {job.description}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/40 pt-4">
        {job.salary != null && (
          <span className="text-xs font-medium text-muted-foreground">
            ${job.salary.toLocaleString()}
          </span>
        )}
        <Button asChild size="sm" variant="outline" className="ml-auto group/btn">
          <Link href={`/jobs/${job.job_id}`}>
            View details <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
