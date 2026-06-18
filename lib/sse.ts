export async function* fetchSSE<T = Record<string, unknown>>(
  url: string,
  body?: unknown,
  signal?: AbortSignal
): AsyncGenerator<T> {
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: body instanceof FormData ? undefined : { "Content-Type": "application/json" },
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    signal,
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

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

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
      yield JSON.parse(dataStr) as T;
    }
  }
}
