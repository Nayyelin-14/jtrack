"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";

export default function CareerGuidancePage() {
  const user = useAuthStore((s) => s.user);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    // TODO: connect to SSE endpoint
    setTimeout(() => {
      setResult("Career guidance analysis will be available soon.");
      setLoading(false);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
            <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">Career Guidance</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Get AI-powered career advice tailored to your profile.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div className="space-y-2">
            <Label htmlFor="query">What would you like guidance on?</Label>
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-400"
              placeholder="Describe your career situation, goals, and what you need help with..."
            />
          </div>
          <Button type="submit" disabled={loading || !query.trim()}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Get Guidance
          </Button>
        </form>

        {result && (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6">
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </main>
    </div>
  );
}
