import type { JobAnalyticsResponse } from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost/api";

async function handle<T>(res: Response): Promise<T> {
  let data: T;
  try { data = await res.json(); } catch { throw new Error(`Request failed (${res.status})`); }
  if (!res.ok) {
    const msg = (data as any)?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export const analyticsApi = {
  getJobAnalytics(jobId: number) {
    return fetch(`${BASE}/jobs/analytics/${jobId}`, { credentials: "include" }).then(handle<JobAnalyticsResponse>);
  },
};
