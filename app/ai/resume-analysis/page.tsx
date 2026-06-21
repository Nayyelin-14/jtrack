"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, Upload, Loader2, FileText } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ResumeAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

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
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-6">
            <div className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Resume Analysis</h1>
              <p className="text-xs text-muted-foreground">Get an ATS score and actionable feedback on your resume.</p>
            </div>
          </div>
        </motion.div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) { setFile(f); } }}
              onClick={() => fileRef.current?.click()}
              className={`grid cursor-pointer place-items-center rounded-xl border-2 border-dashed p-10 text-center transition ${
                dragOver ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/50 hover:bg-accent/30"
              }`}
            >
              <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
                <Upload className="h-5 w-5 text-primary-foreground" />
              </div>
              <p className="text-sm font-semibold">
                {file ? file.name : "Drop your PDF here or click to browse"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">PDF only · max 10MB</p>
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading || !file}
              className="w-full gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading ? "Analyzing…" : "Analyze Resume"}
            </Button>

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-border/60 bg-muted/30 p-5"
              >
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{result}</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
