"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Loader2, Send, StopCircle, User } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

type Msg = { role: "user" | "assistant"; text: string };

export default function CareerGuidancePage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const send = async () => {
    const q = input.trim();
    if (!q || streaming) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }, { role: "assistant", text: "" }]);
    setStreaming(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const response = await fetch("/api/ai/career-guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          context: messages.map((m) => `${m.role}: ${m.text}`).join("\n"),
        }),
        signal: ctrl.signal,
      });
      if (!response.ok) throw new Error("AI request failed");
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = {
            role: "assistant",
            text: copy[copy.length - 1].text + text,
          };
          return copy;
        });
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      // Silent fail for now
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const stop = () => {
    abortRef.current?.abort();
    setStreaming(false);
  };

  const suggestions = [
    "How do I transition from frontend to full-stack?",
    "What skills should I add to my resume for product roles?",
    "How do I negotiate salary for a senior position?",
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold tracking-tight">Career guidance</h1>
          <p className="text-xs text-muted-foreground">Powered by AI · streams in real-time</p>
        </div>

        <Card className="flex flex-col overflow-hidden" style={{ minHeight: "calc(100vh - 18rem)" }}>
          <CardContent className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-12">
                <Sparkles className="mb-3 h-10 w-10 text-primary/40" />
                <p className="text-sm text-muted-foreground">Ask anything about your career.</p>
                <div className="mt-5 grid w-full max-w-md gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      className="rounded-xl border border-border bg-card px-3 py-2 text-left text-sm transition hover:border-primary/50 hover:bg-primary/5"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
                  >
                    {m.role === "assistant" && (
                      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] whitespace-pre-wrap rounded-lg px-4 py-2.5 text-sm ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-muted"
                      }`}
                    >
                      {m.text || (streaming && i === messages.length - 1 ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : "")}
                    </div>
                    {m.role === "user" && (
                      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted">
                        <User className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </CardContent>

          <div className="border-t border-border bg-background p-3">
            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="flex items-end gap-2"
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about skills, roles, salary, interviews…"
                rows={1}
                className="min-h-10 resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
              />
              {streaming ? (
                <Button type="button" variant="destructive" onClick={stop} className="gap-1.5 shrink-0">
                  <StopCircle className="h-4 w-4" /> Stop
                </Button>
              ) : (
                <Button type="submit" disabled={!input.trim()} className="gap-1.5 shrink-0">
                  <Send className="h-4 w-4" /> Send
                </Button>
              )}
            </form>
          </div>
        </Card>
      </main>
    </div>
  );
}
