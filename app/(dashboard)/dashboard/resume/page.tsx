"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Upload, FileText, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { userApi } from "@/lib/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";

export default function ResumePage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const uploadResume = useMutation({
    mutationFn: (file: File) => userApi.uploadResume(file),
    onSuccess: (res: { success: boolean; message: string; url?: string }) => {
      toast.success("Resume uploaded");
      if (user) setUser({ ...user, resume: res.url ?? null });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") {
      toast.error("Please upload a PDF");
      return;
    }
    uploadResume.mutate(f);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Resume</h1>
        <p className="text-sm text-muted-foreground">Upload a PDF resume to fast-track applications.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your resume</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user?.resume ? (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-success/30 bg-success/5 p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-success/15 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Resume on file</p>
                  <a href={user.resume} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">View PDF</a>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-lg border border-dashed border-border/60 bg-muted/30 p-4">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No resume uploaded yet.</p>
            </div>
          )}

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
            onClick={() => fileRef.current?.click()}
            className={`grid cursor-pointer place-items-center rounded-xl border-2 border-dashed p-10 text-center transition ${
              dragOver ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/50 hover:bg-accent/30"
            }`}
          >
            <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
              {uploadResume.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary-foreground" />
              ) : (
                <Upload className="h-5 w-5 text-primary-foreground" />
              )}
            </div>
            <p className="text-sm font-semibold">
              {uploadResume.isPending ? "Uploading…" : "Drop your PDF here or click to browse"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">PDF only · max 10MB</p>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
