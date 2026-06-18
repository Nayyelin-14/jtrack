"use client";

import { useState, useRef, useCallback } from "react";

export type SSEStatus = "idle" | "connecting" | "streaming" | "complete" | "error";

export function useSSE() {
  const [status, setStatus] = useState<SSEStatus>("idle");
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const start = useCallback(
    async (
      url: string,
      options: {
        method?: string;
        body?: BodyInit;
        onProgress?: (message: string) => void;
        onChunk?: (text: string) => void;
        onComplete?: (data: unknown) => void;
        onError?: (message: string) => void;
      } = {}
    ) => {
      setStatus("connecting");
      setProgress(null);
      setError(null);
      abortRef.current = new AbortController();

      try {
        const res = await fetch(url, {
          method: options.method || "POST",
          credentials: "include",
          body: options.body,
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          let msg = `Request failed (${res.status})`;
          try {
            const err = await res.json();
            msg = err.message || msg;
          } catch {}
          throw new Error(msg);
        }

        setStatus("streaming");
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

            let event: Record<string, unknown>;
            try {
              event = JSON.parse(dataStr);
            } catch {
              continue;
            }

            if (event.status === "progress") {
              const msg = event.message as string;
              setProgress(msg);
              options.onProgress?.(msg);
            } else if (event.status === "chunk") {
              options.onChunk?.((event.text as string) || "");
            } else if (event.status === "error") {
              const msg = (event.errors as string[])?.length
                ? (event.errors as string[]).join("; ")
                : (event.message as string) || "Stream error";
              setError(msg);
              setStatus("error");
              options.onError?.(msg);
              return true;
            } else if (event.status === "complete") {
              setStatus("complete");
              setProgress(null);
              options.onComplete?.(event);
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
        if (status !== "error") {
          setStatus("complete");
          setProgress(null);
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          setStatus("idle");
          setProgress(null);
          return;
        }
        const msg = (err as Error).message || "Request failed";
        setError(msg);
        setStatus("error");
        options.onError?.(msg);
      }
    },
    [status]
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
    setStatus("idle");
    setProgress(null);
  }, []);

  return { status, progress, error, start, abort };
}
