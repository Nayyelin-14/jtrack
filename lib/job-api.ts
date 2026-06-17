import type { SSEEvent } from "@/lib/types";

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

export const jobApi = {
  activeJobs(params: { title?: string; location?: string; page?: number; limit?: number }) {
    const qs = new URLSearchParams();
    if (params.title) qs.set("title", params.title);
    if (params.location) qs.set("location", params.location);
    qs.set("page", String(params.page ?? 1));
    qs.set("limit", String(params.limit ?? 20));
    return fetch(`${BASE}/jobs/active-jobs?${qs}`).then(handle);
  },

  jobDetail(jobId: number) {
    return fetch(`${BASE}/jobs/jobs/${jobId}`).then(handle);
  },

  apply(jobId: number) {
    return fetch(`${BASE}/jobs/apply`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    }).then(handle);
  },

  myApplications() {
    return fetch(`${BASE}/jobs/my-applications`, {
      method: "GET",
      credentials: "include",
    }).then(handle);
  },

  analyzeMatch(
    jobId: number,
    callbacks?: {
      onProgress?: (message: string) => void;
      onChunk?: (text: string) => void;
      onComplete?: (event: SSEEvent) => void;
      onError?: (message: string) => void;
    }
  ): Promise<void> {
    return fetch(`${BASE}/jobs/analyze-match/${jobId}`, {
      method: "POST",
      credentials: "include",
    }).then(async (res) => {
      if (!res.ok) {
        let msg = `Request failed (${res.status})`;
        try {
          const err = await res.json();
          msg = err.message || msg;
        } catch {}
        throw new Error(msg);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      function processBuffer() {
        const normalized = buffer.replace(/\r\n/g, "\n");
        const parts = normalized.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const raw of parts) {
          const lines = raw.split("\n");
          let dataStr = "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              dataStr += line.slice(6);
            }
          }

          if (!dataStr) continue;

          let event: SSEEvent;
          try {
            event = JSON.parse(dataStr);
          } catch {
            continue;
          }

          if (event.status === "progress" && callbacks?.onProgress) {
            callbacks.onProgress(event.message ?? "");
          } else if (event.status === "chunk" && callbacks?.onChunk) {
            callbacks.onChunk(event.text ?? "");
          } else if (event.status === "error") {
            const msg = event.errors?.length
              ? event.errors.join("; ")
              : event.message || "Analysis failed";
            callbacks?.onError?.(msg);
            return true;
          } else if (event.status === "complete") {
            callbacks?.onComplete?.(event);
            return true;
          }
        }
        return false;
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        if (processBuffer()) return;
      }

      processBuffer();
    });
  },
};
