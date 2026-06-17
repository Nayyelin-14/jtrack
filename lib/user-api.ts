import type { SkillResponse, UpdateProfileInput } from "@/lib/types";

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

export const userApi = {
  getProfile() {
    return fetch(`${BASE}/users/me`, { credentials: "include" }).then(handle<any>);
  },

  update(data: UpdateProfileInput) {
    return fetch(`${BASE}/users/update`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(handle<{ success: boolean; message: string; user?: any }>);
  },

  updateBio(bio: string) {
    return fetch(`${BASE}/users/bio`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bio }) }).then(handle<{ success: boolean; message: string }>);
  },

  uploadProfilePic(file: File) {
    const fd = new FormData();
    fd.append("profile_pic", file);
    return fetch(`${BASE}/users/profile-pic`, { method: "POST", credentials: "include", body: fd }).then(handle<{ success: boolean; message: string; url?: string }>);
  },

  uploadResume(file: File) {
    const fd = new FormData();
    fd.append("resume", file);
    return fetch(`${BASE}/users/resume`, { method: "POST", credentials: "include", body: fd }).then(handle<{ success: boolean; message: string; url?: string }>);
  },

  getSkills() {
    return fetch(`${BASE}/users/skills`).then(handle<SkillResponse>);
  },

  addSkills(names: string[]) {
    return fetch(`${BASE}/users/add-skill`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ skills: names.map((n) => ({ name: n })) }) }).then(handle<{ success: boolean; message: string; skills?: any[] }>);
  },

  removeSkills(skillIds: number[]) {
    return fetch(`${BASE}/users/remove-skill`, { method: "DELETE", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ skill_ids: skillIds }) }).then(handle<{ success: boolean; message: string }>);
  },
};
