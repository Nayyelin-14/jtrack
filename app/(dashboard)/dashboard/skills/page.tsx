"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { userApi } from "@/lib/users";
import type { SkillResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SkillsPage() {
  const queryClient = useQueryClient();
  const [newSkill, setNewSkill] = useState("");

  const { data: skillsData, isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: () => userApi.getSkills() as Promise<SkillResponse>,
    staleTime: 30_000,
  });

  const addSkill = useMutation({
    mutationFn: (skill: string) => userApi.addSkills([skill]),
    onSuccess: () => {
      toast.success("Skill added");
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      setNewSkill("");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const removeSkill = useMutation({
    mutationFn: (skillId: number) => userApi.removeSkills([skillId]),
    onSuccess: () => {
      toast.success("Skill removed");
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const skills = skillsData?.skills ?? [];

  return (
    <>
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
      </Link>
      <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Skills</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Manage the skills on your profile.</p>

      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-zinc-400" /></div>
      ) : (
        <div className="max-w-xl space-y-4">
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s.skill_id} className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                {s.name}
                <button onClick={() => removeSkill.mutate(s.skill_id)} disabled={removeSkill.isPending} className="hover:text-red-500 transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {skills.length === 0 && <p className="text-sm text-zinc-500">No skills added yet.</p>}
          </div>
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              className="rounded-lg"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (newSkill.trim()) addSkill.mutate(newSkill.trim()); } }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => { if (newSkill.trim()) addSkill.mutate(newSkill.trim()); }}
              disabled={addSkill.isPending || !newSkill.trim()}
              className="rounded-lg shrink-0"
            >
              {addSkill.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
