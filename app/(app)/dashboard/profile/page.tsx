"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { Loader2, UserIcon, Mail, Upload, FileText, X, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { userApi } from "@/lib/user-api";
import { useAuthStore } from "@/stores/auth-store";
import type { SkillResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [newSkill, setNewSkill] = useState("");

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userApi.getProfile(),
    staleTime: 30_000,
  });

  const { data: skillsData, isLoading: skillsLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: () => userApi.getSkills() as Promise<SkillResponse>,
    staleTime: 30_000,
  });

  const updateName = useMutation({
    mutationFn: (val: string) => userApi.update({ name: val }),
    onSuccess: () => {
      toast.success("Name updated");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      if (user) setUser({ ...user, name });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateBio = useMutation({
    mutationFn: (val: string) => userApi.updateBio(val),
    onSuccess: () => {
      toast.success("Bio updated");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: Error) => toast.error(err.message),
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

  const profilePicRef = useRef<HTMLInputElement>(null);
  const resumeRef = useRef<HTMLInputElement>(null);

  const uploadPic = useMutation({
    mutationFn: (file: File) => userApi.uploadProfilePic(file),
    onSuccess: () => {
      toast.success("Profile picture updated");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const uploadResumeFile = useMutation({
    mutationFn: (file: File) => userApi.uploadResume(file),
    onSuccess: () => {
      toast.success("Resume uploaded");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (profileLoading || skillsLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
      </div>
    );
  }

  const profile = profileData?.user;
  const skills: Array<{ skill_id: number; name: string }> = skillsData?.skills ?? [];

  return (
    <>
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
      </Link>
      <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Profile</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Manage your account information.</p>

      <div className="max-w-xl space-y-6">
        <div className="flex items-center gap-4">
          {profile?.profile_pic ? (
            <img src={profile.profile_pic} alt="" className="h-16 w-16 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 ring-2 ring-indigo-500/20">
              <UserIcon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            </div>
          )}
          <div>
            <Button variant="outline" size="sm" onClick={() => profilePicRef.current?.click()} className="rounded-lg text-xs">
              <Upload className="h-3.5 w-3.5 mr-1" /> Change Photo
            </Button>
            <input ref={profilePicRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPic.mutate(f); }} />
            <p className="text-xs text-zinc-500 mt-1">PNG or JPG</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Name</Label>
          <div className="flex gap-2">
            <Input value={name || profile?.name || ""} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="rounded-lg" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateName.mutate(name)}
              disabled={updateName.isPending || !name.trim() || name === profile?.name}
              className="rounded-lg shrink-0"
            >
              {updateName.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <div className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Mail className="h-4 w-4 text-zinc-400" />
            {profile?.email ?? user?.email}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Bio</Label>
          <div className="flex gap-2">
            <textarea
              value={bio || profile?.bio || ""}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-400"
              placeholder="Tell us about yourself..."
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateBio.mutate(bio)}
              disabled={updateBio.isPending || bio === profile?.bio}
              className="rounded-lg shrink-0 self-start"
            >
              {updateBio.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Resume</Label>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => resumeRef.current?.click()} className="rounded-lg text-xs">
              <Upload className="h-3.5 w-3.5 mr-1" /> Upload Resume
            </Button>
            <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadResumeFile.mutate(f); }} />
            {profile?.resume && (
              <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                <FileText className="h-3.5 w-3.5" /> View resume
              </a>
            )}
          </div>
          <p className="text-xs text-zinc-500">PDF or DOC</p>
        </div>

        <div className="space-y-2">
          <Label>Skills</Label>
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((s) => (
              <span key={s.skill_id} className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                {s.name}
                <button onClick={() => removeSkill.mutate(s.skill_id)} disabled={removeSkill.isPending} className="hover:text-red-500 transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
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
      </div>
    </>
  );
}
