"use client";

import Link from "next/link";
import { MapPin, ExternalLink } from "lucide-react";
import type { Job } from "@/types";

type Props = {
  job: Job;
  onSelect?: (job: Job) => void;
  isSelected?: boolean;
};

export function JobCard({ job, onSelect, isSelected }: Props) {
  if (onSelect) {
    return (
      <button
        onClick={() => onSelect(job)}
        className={`group relative w-full text-left rounded-lg border transition-colors cursor-pointer overflow-hidden ${
          isSelected
            ? "border-primary bg-primary/[0.04]"
            : "border-border bg-card hover:border-foreground/20"
        }`}
      >
        {isSelected && (
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-r-sm" />
        )}

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {job.company_logo && (
                  <img src={job.company_logo} alt="" className="h-5 w-5 rounded object-contain" />
                )}
                <span className="text-[13px] font-medium text-muted-foreground">
                  {job.company_name}
                </span>
              </div>
              <h3 className={`mt-1.5 font-display text-base font-semibold leading-snug tracking-tight ${
                isSelected ? "text-primary" : "text-foreground"
              }`}>
                {job.title}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground/80">
                {job.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {job.location}
                  </span>
                )}
                <span className="bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">
                  {job.job_type}
                </span>
                <span className="bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">
                  {job.work_location}
                </span>
              </div>
            </div>

            {job.salary != null && (
              <span className="shrink-0 text-sm font-semibold text-success">
                ${job.salary >= 1000 ? `${(job.salary / 1000).toFixed(0)}k` : job.salary}
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider">
              {job.role}
            </span>
            <Link
              href={`/jobs/${job.job_id}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Open <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="group relative rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/20">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {job.company_logo && (
              <img src={job.company_logo} alt="" className="h-5 w-5 rounded object-contain" />
            )}
            <span className="text-[13px] font-medium text-muted-foreground">
              {job.company_name}
            </span>
          </div>
          <h3 className="mt-1.5 font-display text-base font-semibold leading-snug tracking-tight">
            {job.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground/80">
            {job.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {job.location}
              </span>
            )}
            <span className="bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">
              {job.job_type}
            </span>
            <span className="bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">
              {job.work_location}
            </span>
          </div>
          <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {job.description}
          </p>
        </div>
        {job.salary != null && (
          <span className="shrink-0 text-sm font-semibold text-success">
            ${job.salary.toLocaleString()}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3.5">
        <span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider">
          {job.role}
        </span>
        <Link
          href={`/jobs/${job.job_id}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View details
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
