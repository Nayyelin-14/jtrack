export type Job = {
  job_id: number;
  title: string;
  description: string;
  salary: number | null;
  location: string | null;
  job_type: string;
  role: string;
  work_location: string;
  openings: number;
  created_at: string;
  company_name: string;
  company_logo: string | null;
  company_id: number;
};

export type ActiveJobsResponse = {
  success: boolean;
  count: number;
  total: number;
  page: number;
  totalPages: number;
  jobs: Job[];
};

export type JobDetails = {
  responsibilities?: string;
  required_skills?: string;
  preferred_skills?: string;
  tech_stack?: string[];
  experience_years?: number;
  education?: string;
  certifications?: string[];
  languages?: string[];
  benefits?: string;
  visa_sponsorship?: boolean;
  working_hours?: string;
  team_structure?: string;
  reporting_line?: string;
  career_growth?: string;
  interview_process?: string;
};

export type JobDetailResponse = {
  success: boolean;
  fromCache?: boolean;
  job: Job & JobDetails & {
    company_description?: string;
    company_website?: string;
    total_applications?: number;
    details?: JobDetails;
  };
};

export type Application = {
  application_id: number;
  status: string;
  applied_at: string;
  subscribed: boolean | null;
  job_id: number;
  job_title: string;
  job_salary: number | null;
  job_location: string | null;
  job_type: string;
  work_location: string;
  is_active: boolean | null;
  company_id: number;
  company_name: string;
  company_logo: string | null;
};

export type ApplicationsResponse = {
  success: boolean;
  count: number;
  applications: Application[];
};

export type ApplyResponse = {
  success: boolean;
  message: string;
  application?: unknown;
};

export type AnalyzeMatchResult = {
  matchScore: number;
  strengths: string[];
  gaps: string[];
  recommendation: "yes" | "maybe" | "no";
  recommendationReason: string;
  summary: string;
  fullAnalysis: string;
};

export type SSEEvent = {
  status: "progress" | "complete" | "error" | "chunk";
  message?: string;
  errors?: string[];
  result?: AnalyzeMatchResult;
  text?: string;
};
