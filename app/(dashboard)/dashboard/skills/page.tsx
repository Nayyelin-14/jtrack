"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Plus, X, ArrowLeft, Wrench } from "lucide-react";
import Link from "next/link";
import { userApi } from "@/lib/users";
import type { SkillResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="space-y-6">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
      </Link>

      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Skills</h1>
        <p className="text-xs text-muted-foreground">Showcase what you do best.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add a skill</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => { e.preventDefault(); if (newSkill.trim()) addSkill.mutate(newSkill.trim()); }}
                className="flex gap-2"
              >
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="e.g. TypeScript, GraphQL, Figma"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (newSkill.trim()) addSkill.mutate(newSkill.trim()); } }}
                />
                <Button type="submit" disabled={addSkill.isPending || !newSkill.trim()} className="gap-1.5">
                  {addSkill.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Add
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your skills</CardTitle>
            </CardHeader>
            <CardContent>
              {skills.length === 0 ? (
                <div className="grid place-items-center py-10 text-center">
                  <Wrench className="mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No skills yet. Add your first above.</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {skills.map((s) => (
                      <motion.div
                        key={s.skill_id}
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Badge variant="secondary" className="gap-1.5 py-1.5 pl-3 pr-1.5 text-sm">
                          {s.name}
                          <button
                            onClick={() => removeSkill.mutate(s.skill_id)}
                            disabled={removeSkill.isPending}
                            className="grid h-4 w-4 place-items-center rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors"
                            aria-label={`Remove ${s.name}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
