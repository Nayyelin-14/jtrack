import type { ApplicationsResponse, ApplyResponse } from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost/api";

async function handle<T>(res: Response): Promise<T> {
  let data: T;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Request failed (${res.status})`);
  }
  if (!res.ok) {
    const msg = (data as any)?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export const applicationsApi = {
  myApplications() {
    return fetch(`${BASE}/jobs/my-applications`, {
      method: "GET",
      credentials: "include",
    }).then(handle<ApplicationsResponse>);
  },

  applicationsByJob(jobId: number) {
    return fetch(`${BASE}/jobs/applications-by-job/${jobId}`, {
      credentials: "include",
    }).then(handle<ApplicationsResponse>);
  },

  apply(jobId: number) {
    return fetch(`${BASE}/jobs/apply`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    }).then(handle<ApplyResponse>);
  },

  updateStatus(applicationId: number, status: string) {
    return fetch(`${BASE}/jobs/application/${applicationId}/status`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).then(handle<{ success: boolean; message: string }>);
  },
};
