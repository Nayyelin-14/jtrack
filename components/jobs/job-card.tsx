"use client";

import Link from "next/link";
import { MapPin, ExternalLink } from "lucide-react";
import type { Job } from "@/lib/types";

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
        className={`group relative w-full text-left rounded-lg border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
          isSelected
            ? "border-indigo-500/60 bg-indigo-500/[0.08] shadow-sm shadow-indigo-500/10"
            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm"
        }`}
      >
        {isSelected && (
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-500 rounded-r-sm" />
        )}

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {job.company_logo && (
                  <img src={job.company_logo} alt="" className="h-5 w-5 rounded object-contain" />
                )}
                <span className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
                  {job.company_name}
                </span>
              </div>
              <h3 className={`mt-1.5 text-base font-semibold leading-snug tracking-tight ${
                isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-900 dark:text-zinc-100"
              }`}>
                {job.title}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-2.5 text-xs text-zinc-400 dark:text-zinc-500">
                {job.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {job.location}
                  </span>
                )}
                <span className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500 dark:text-zinc-400">
                  {job.job_type}
                </span>
                <span className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500 dark:text-zinc-400">
                  {job.work_location}
                </span>
              </div>
            </div>

            {job.salary != null && (
              <span className="shrink-0 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                ${job.salary >= 1000 ? `${(job.salary / 1000).toFixed(0)}k` : job.salary}
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3">
            <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              {job.role}
            </span>
            <Link
              href={`/jobs/${job.job_id}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
            >
              Open <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="group relative rounded-lg border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {job.company_logo && (
              <img src={job.company_logo} alt="" className="h-5 w-5 rounded object-contain" />
            )}
            <span className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
              {job.company_name}
            </span>
          </div>
          <h3 className="mt-1.5 text-base font-semibold leading-snug tracking-tight text-zinc-900 dark:text-zinc-100">
            {job.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2.5 text-xs text-zinc-400 dark:text-zinc-500">
            {job.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {job.location}
              </span>
            )}
            <span className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500 dark:text-zinc-400">
              {job.job_type}
            </span>
            <span className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500 dark:text-zinc-400">
              {job.work_location}
            </span>
          </div>
          <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            {job.description}
          </p>
        </div>
        {job.salary != null && (
          <span className="shrink-0 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            ${job.salary.toLocaleString()}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3.5">
        <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          {job.role}
        </span>
        <Link
          href={`/jobs/${job.job_id}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          View details
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
