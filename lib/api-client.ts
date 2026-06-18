const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost/api";

async function handle<T>(res: Response): Promise<T> {
  let data: T;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Request failed (${res.status})`);
  }

  if (res.status === 401 && typeof window !== "undefined") {
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
      throw new Error("Session expired. Please sign in again.");
    }
  }

  if (!res.ok) {
    const msg = (data as any)?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

export const apiClient = {
  get<T>(path: string, options?: RequestInit) {
    return fetch(`${BASE}${path}`, {
      method: "GET",
      credentials: "include",
      ...options,
    }).then(handle<T>);
  },

  post<T>(path: string, body?: unknown, options?: RequestInit) {
    return fetch(`${BASE}${path}`, {
      method: "POST",
      credentials: "include",
      headers: body instanceof FormData ? undefined : { "Content-Type": "application/json" },
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
      ...options,
    }).then(handle<T>);
  },

  put<T>(path: string, body?: unknown, options?: RequestInit) {
    return fetch(`${BASE}${path}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }).then(handle<T>);
  },

  patch<T>(path: string, body?: unknown, options?: RequestInit) {
    return fetch(`${BASE}${path}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }).then(handle<T>);
  },

  delete<T>(path: string, options?: RequestInit) {
    return fetch(`${BASE}${path}`, {
      method: "DELETE",
      credentials: "include",
      ...options,
    }).then(handle<T>);
  },
};
