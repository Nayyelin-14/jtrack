import type { SkillResponse } from "@/types";

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

export const skillsApi = {
  getAll() {
    return fetch(`${BASE}/users/skills`).then(handle<SkillResponse>);
  },

  add(names: string[]) {
    return fetch(`${BASE}/users/add-skill`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skills: names.map((n) => ({ name: n })) }),
    }).then(handle<{ success: boolean; message: string; skills?: any[] }>);
  },

  remove(skillIds: number[]) {
    return fetch(`${BASE}/users/remove-skill`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill_ids: skillIds }),
    }).then(handle<{ success: boolean; message: string }>);
  },
};
