import type { CompanyListResponse, MyCompaniesResponse, CompanyResponse, CompanyDetailResponse } from "@/types";

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

export const companyApi = {
  list(params?: { page?: number; limit?: number }) {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    return fetch(`${BASE}/jobs/${qs.toString() ? `?${qs}` : ""}`).then(handle<CompanyListResponse>);
  },

  myCompanies() {
    return fetch(`${BASE}/jobs/my-companies`, {
      credentials: "include",
    }).then(handle<MyCompaniesResponse>);
  },

  getById(companyId: number) {
    return fetch(`${BASE}/jobs/${companyId}`).then(handle<CompanyResponse>);
  },

  getDetail(companyId: number) {
    return fetch(`${BASE}/jobs/detail/${companyId}`, { credentials: "include" }).then(handle<CompanyDetailResponse>);
  },

  create(formData: FormData) {
    return fetch(`${BASE}/jobs/create-com`, { method: "POST", credentials: "include", body: formData }).then(handle<{ success: boolean; message: string; company: any }>);
  },

  update(companyId: number, data: Record<string, unknown>) {
    return fetch(`${BASE}/jobs/${companyId}`, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(handle<{ success: boolean; message: string; company: any }>);
  },

  remove(companyId: number) {
    return fetch(`${BASE}/jobs/${companyId}`, { method: "DELETE", credentials: "include" }).then(handle<{ success: boolean; message: string }>);
  },
};
