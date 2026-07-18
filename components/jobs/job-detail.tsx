"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  MapPin,
  Send,
  Loader2,
  Sparkles,
  Building2,
  Briefcase,
  Clock,
  Users,
  GraduationCap,
  Globe,
  ShieldCheck,
  Target,
  ChevronRight,
  DollarSign,
  Calendar,
  FileText,
  ListChecks,
  Lightbulb,
  Star,
  TreePine,
} from "lucide-react";
import type { JobDetailResponse, JobDetails } from "@/types";
import { jobApi } from "@/lib/jobs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnalyzeMatch } from "@/components/jobs/analyze-match";

type Props = {
  job: JobDetailResponse["job"];
  isSeeker: boolean;
  hasApplied?: boolean;
};

function field<T>(job: Props["job"], key: keyof JobDetails): T | undefined {
  return (job as any)[key] ?? job.details?.[key] as T | undefined;
}

export function JobDetail({ job, isSeeker, hasApplied = false }: Props) {
  const [applied, setApplied] = useState(hasApplied);

  const apply = useMutation({
    mutationFn: () => jobApi.apply(job.job_id),
    onSuccess: () => {
      toast.success("Application submitted!");
      setApplied(true);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const techStack = field<string[]>(job, "tech_stack");
  const certifications = field<string[]>(job, "certifications");
  const languages = field<string[]>(job, "languages");

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-border bg-card">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1 space-y-3">
              {job.company_logo && (
                <img
                  src={job.company_logo}
                  alt=""
                  className="h-10 w-10 rounded-xl object-contain"
                />
              )}
              <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {job.company_name}
                </span>
                {job.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {job.location}
                  </span>
                )}
                {job.salary != null && (
                  <span className="flex items-center gap-1.5 font-semibold text-success">
                    <DollarSign className="h-4 w-4" />
                    ${job.salary.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{job.role}</Badge>
                <Badge variant="outline">{job.job_type}</Badge>
                <Badge variant="outline">{job.work_location}</Badge>
                {job.openings > 1 && (
                  <Badge variant="outline">{job.openings} openings</Badge>
                )}
              </div>
            </div>

            {isSeeker && (
              <div className="flex shrink-0 flex-col gap-2">
                <Button
                  size="lg"
                  onClick={() => apply.mutate()}
                  disabled={apply.isPending || applied}
                  className="w-full sm:w-auto"
                >
                  {apply.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : applied ? (
                    "Applied \u2713"
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Apply now
                    </>
                  )}
                </Button>
                <AnalyzeMatch jobId={job.job_id} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Info Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {field<number>(job, "experience_years") != null && (
          <Card className="border-border">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Experience</p>
                <p className="text-sm font-semibold">
                  {field<number>(job, "experience_years")}+ years
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        {field<string>(job, "education") && (
          <Card className="border-border">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Education</p>
                <p className="text-sm font-semibold">{field<string>(job, "education")}</p>
              </div>
            </CardContent>
          </Card>
        )}
        {languages && languages.length > 0 && (
          <Card className="border-border">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Languages</p>
                <p className="text-sm font-semibold">{languages.join(", ")}</p>
              </div>
            </CardContent>
          </Card>
        )}
        {field<boolean>(job, "visa_sponsorship") != null && (
          <Card className="border-border">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Visa Sponsorship</p>
                <p className="text-sm font-semibold">
                  {field<boolean>(job, "visa_sponsorship") ? "Available" : "Not available"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Description */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" /> Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm leading-relaxed text-muted-foreground">
            {job.description.split("\n").map((p, i) => (
              <p key={i} className={i > 0 ? "mt-2" : ""}>{p}</p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      {techStack && techStack.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ListChecks className="h-4 w-4 text-primary" /> Tech Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {techStack.map((t) => (
                <Badge key={t} variant="secondary">{t}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Responsibilities & Skills */}
      <div className="grid gap-6 md:grid-cols-2">
        {field<string>(job, "responsibilities") && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-4 w-4 text-primary" /> Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {field<string>(job, "responsibilities")}
              </p>
            </CardContent>
          </Card>
        )}
        {field<string>(job, "required_skills") && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Star className="h-4 w-4 text-primary" /> Required Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {field<string>(job, "required_skills")}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Preferred Skills */}
      {field<string>(job, "preferred_skills") && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-4 w-4 text-primary" /> Preferred Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {field<string>(job, "preferred_skills")}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4 text-primary" /> Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {certifications.map((c, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ChevronRight className="h-3.5 w-3.5 text-primary" /> {c}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Benefits */}
      {field<string>(job, "benefits") && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TreePine className="h-4 w-4 text-primary" /> Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {field<string>(job, "benefits")!.split(",").map((b, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {b.trim()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Work Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {field<string>(job, "working_hours") && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-primary" /> Working Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {field<string>(job, "working_hours")}
              </p>
            </CardContent>
          </Card>
        )}
        {field<string>(job, "team_structure") && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4 text-primary" /> Team Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {field<string>(job, "team_structure")}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {field<string>(job, "reporting_line") && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ChevronRight className="h-4 w-4 text-primary" /> Reports To
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {field<string>(job, "reporting_line")}
              </p>
            </CardContent>
          </Card>
        )}
        {field<string>(job, "career_growth") && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TreePine className="h-4 w-4 text-primary" /> Career Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {field<string>(job, "career_growth")}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Interview Process */}
      {field<string>(job, "interview_process") && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4 text-primary" /> Interview Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {field<string>(job, "interview_process")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
