"use client";

import { useState, useRef } from "react";
import { Sparkles, Upload, Loader2, FileText } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";

export default function ResumeAnalysisPage() {
  const user = useAuthStore((s) => s.user);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setResult(null);
    // TODO: connect to SSE endpoint
    setTimeout(() => {
      setResult("Resume analysis will be available soon.");
      setLoading(false);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
            <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">Resume Analysis</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Get an ATS score and actionable feedback on your resume.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div className="space-y-2">
            <Label>Upload your resume</Label>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
                <Upload className="h-4 w-4 mr-1.5" /> Choose File
              </Button>
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              {file && <span className="text-sm text-zinc-500">{file.name}</span>}
            </div>
          </div>
          <Button type="submit" disabled={loading || !file}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Analyze Resume
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
