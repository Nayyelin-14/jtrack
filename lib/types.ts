export type AuthUser = {
  user_id: string;
  name: string;
  email: string;
  role: "recruiter" | "jobseeker";
  bio?: string | null;
  phone_number?: string | null;
  profile_pic?: string | null;
  resume?: string | null;
  subscription?: string | null;
};

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
  is_active?: boolean;
};

export type RecruiterJob = Job & {
  total_applications: number;
};

export type MyJobsResponse = {
  success: boolean;
  count: number;
  total: number;
  jobs: RecruiterJob[];
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
  match_score?: number;
  resume?: string | null;
  user_id?: number;
  name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  bio?: string | null;
  profile_pic?: string | null;
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

export type RecruiterApplication = {
  application_id: number;
  status: string;
  applied_at: string;
  subscribed: boolean | null;
  resume: string | null;
  user_id: number;
  name: string | null;
  email: string | null;
  phone_number: string | null;
  bio: string | null;
  profile_pic: string | null;
  job_id: number;
  title: string;
};

export type RecruiterApplicationsResponse = {
  success: boolean;
  count: number;
  applications: RecruiterApplication[];
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

export type Company = {
  company_id: number;
  name: string;
  description: string | null;
  website: string | null;
  logo: string | null;
  size: string | null;
  industry: string | null;
  location: string | null;
  created_at: string;
};

export type CompanyDetail = Company & {
  recruiter_id: number;
  jobs?: Job[];
  recruiter?: { name: string; email: string };
};

export type MyCompaniesResponse = {
  success: boolean;
  count: number;
  total: number;
  companies: Company[];
};

export type CompanyListResponse = {
  success: boolean;
  count: number;
  total: number;
  page: number;
  totalPages: number;
  companies: Company[];
};

export type CompanyResponse = {
  success: boolean;
  company: Company;
};

export type CompanyDetailResponse = {
  success: boolean;
  company: CompanyDetail;
};

export type JobAnalytics = {
  daily: Array<{ date: string; views: number; applications: number; status_changes: number }>;
  total_views: number;
  total_applications: number;
};

export type JobAnalyticsResponse = {
  success: boolean;
  analytics: JobAnalytics;
};

export type Skill = {
  skill_id: number;
  name: string;
};

export type SkillResponse = {
  success: boolean;
  skills: Skill[];
};

export type UpdateProfileInput = {
  name?: string;
  phone_number?: string;
  bio?: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};
