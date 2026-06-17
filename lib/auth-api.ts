const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost/api";

export type AuthUser = {
  user_id: string;
  name: string;
  email: string;
  role: "recruiter" | "jobseeker";
};

export type AuthResponse = {
  success: boolean;
  message?: string;
  user?: AuthUser;
  token?: string;
};

async function handle(res: Response): Promise<AuthResponse> {
  let data: AuthResponse;
  try { data = await res.json(); } catch { throw new Error(`Request failed (${res.status})`); }
  if (!res.ok || data.success === false) throw new Error(data?.message || `Request failed (${res.status})`);
  return data;
}

export const authApi = {
  login(email: string, password: string) {
    return fetch(`${BASE}/auth/login`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) }).then(handle);
  },
  register(formData: FormData) {
    return fetch(`${BASE}/auth/register`, { method: "POST", credentials: "include", body: formData }).then(handle);
  },
  forgotPassword(email: string) {
    return fetch(`${BASE}/auth/forgot-password`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }).then(handle);
  },
  resetPassword(token: string, newPassword: string) {
    return fetch(`${BASE}/auth/reset-password/${encodeURIComponent(token)}`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ newPassword }) }).then(handle);
  },
  me() { return fetch(`${BASE}/auth/me`, { method: "GET", credentials: "include" }).then(handle); },
  logout() { return fetch(`${BASE}/auth/logout`, { method: "POST", credentials: "include" }).then(handle); },
  changePassword(currentPassword: string, newPassword: string) {
    return fetch(`${BASE}/auth/change-password`, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword, newPassword }) }).then(handle);
  },
};