import type { SSEEvent } from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost/api";

export const aiApi = {
  careerGuidance(
    query: string,
    callbacks?: {
      onProgress?: (message: string) => void;
      onChunk?: (text: string) => void;
      onComplete?: (event: SSEEvent) => void;
      onError?: (message: string) => void;
    }
  ): Promise<void> {
    return sseFetch(`${BASE}/ai/career-guidance`, { query }, callbacks);
  },

  resumeAnalysis(
    file: File,
    callbacks?: {
      onProgress?: (message: string) => void;
      onChunk?: (text: string) => void;
      onComplete?: (event: SSEEvent) => void;
      onError?: (message: string) => void;
    }
  ): Promise<void> {
    const fd = new FormData();
    fd.append("resume", file);
    return sseFetch(`${BASE}/ai/resume-analysis`, fd, callbacks);
  },

  matchAnalysis(
    jobId: number,
    callbacks?: {
      onProgress?: (message: string) => void;
      onChunk?: (text: string) => void;
      onComplete?: (event: SSEEvent) => void;
      onError?: (message: string) => void;
    }
  ): Promise<void> {
    return sseFetch(`${BASE}/ai/match/${jobId}`, undefined, callbacks);
  },
};

async function sseFetch(
  url: string,
  body: unknown,
  callbacks?: {
    onProgress?: (message: string) => void;
    onChunk?: (text: string) => void;
    onComplete?: (event: SSEEvent) => void;
    onError?: (message: string) => void;
  }
): Promise<void> {
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: body instanceof FormData ? undefined : { "Content-Type": "application/json" },
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

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

  function processBuffer(): boolean {
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
}
