"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Upload, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { userApi } from "@/lib/users";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";

export default function ResumePage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const resumeRef = useRef<HTMLInputElement>(null);

  const uploadResume = useMutation({
    mutationFn: (file: File) => userApi.uploadResume(file),
    onSuccess: () => {
      toast.success("Resume uploaded");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <>
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
      </Link>
      <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Resume</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Upload or update your resume.</p>

      <div className="max-w-xl space-y-4">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <Label>Upload Resume</Label>
          <div className="flex items-center gap-3 mt-2">
            <Button variant="outline" size="sm" onClick={() => resumeRef.current?.click()} className="rounded-lg text-xs">
              <Upload className="h-3.5 w-3.5 mr-1" /> Choose File
            </Button>
            <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadResume.mutate(f); }} />
            {user?.resume && (
              <a href={user.resume} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                <FileText className="h-3.5 w-3.5" /> View current resume
              </a>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-2">PDF or DOC, up to 5MB</p>
        </div>
      </div>
    </>
  );
}
