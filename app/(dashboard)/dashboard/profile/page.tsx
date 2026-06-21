"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2, UserIcon, Mail, Upload, FileText, X, Plus, ArrowLeft, Crown, Camera, Save } from "lucide-react";
import Link from "next/link";
import { userApi } from "@/lib/users";
import { useAuthStore } from "@/store/auth-store";
import type { SkillResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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

  const uploadPic = useMutation({
    mutationFn: (file: File) => userApi.uploadProfilePic(file),
    onSuccess: () => {
      toast.success("Profile picture updated");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (profileLoading || skillsLoading) {
    return (
      <div className="grid h-64 place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const profile = profileData?.user;
  const skills: Array<{ skill_id: number; name: string }> = skillsData?.skills ?? [];
  const initials = (profile?.name ?? "U").split(" ").map((p: string) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account information.</p>
      </div>

      <Card className="glass">
        <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-center">
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-border/60">
              <AvatarImage src={profile?.profile_pic ?? undefined} alt={profile?.name} />
              <AvatarFallback className="bg-primary/15 text-xl font-bold text-primary">{initials}</AvatarFallback>
            </Avatar>
            <button
              onClick={() => profilePicRef.current?.click()}
              className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground shadow-elegant transition hover:scale-105"
              aria-label="Change photo"
            >
              {uploadPic.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
            </button>
            <input ref={profilePicRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPic.mutate(f); }} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold">{profile?.name}</h2>
            <p className="text-sm text-muted-foreground">{profile?.email ?? user?.email}</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Badge variant="secondary" className="capitalize">{profile?.role ?? user?.role}</Badge>
              {profile?.subscription_tier === "premium" && (
                <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 gap-1">
                  <Crown className="h-3 w-3" /> Premium
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <div className="flex gap-2">
                <Input value={name || profile?.name || ""} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateName.mutate(name)}
                  disabled={updateName.isPending || !name.trim() || name === profile?.name}
                  className="shrink-0 gap-1.5"
                >
                  {updateName.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Email</Label>
              <div className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-muted-foreground/60" />
                {profile?.email ?? user?.email}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Bio</Label>
              <div className="flex gap-2">
                <textarea
                  value={bio || profile?.bio || ""}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring resize-none"
                  placeholder="Tell us about yourself..."
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateBio.mutate(bio)}
                  disabled={updateBio.isPending || bio === profile?.bio}
                  className="shrink-0 self-start gap-1.5"
                >
                  {updateBio.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skills &amp; Resume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <Badge key={s.skill_id} variant="secondary" className="gap-1.5 py-1.5 pl-3 pr-1.5 text-sm">
                    {s.name}
                    <button onClick={() => removeSkill.mutate(s.skill_id)} disabled={removeSkill.isPending} className="grid h-4 w-4 place-items-center rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {skills.length === 0 && <p className="text-sm text-muted-foreground">No skills added yet.</p>}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (newSkill.trim()) addSkill.mutate(newSkill.trim()); } }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { if (newSkill.trim()) addSkill.mutate(newSkill.trim()); }}
                  disabled={addSkill.isPending || !newSkill.trim()}
                  className="shrink-0"
                >
                  {addSkill.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Resume</Label>
              <div className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
                <FileText className="h-5 w-5 text-muted-foreground/60" />
                {profile?.resume ? (
                  <>
                    <span className="text-sm text-foreground flex-1">Resume on file</span>
                    <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">View</a>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground flex-1">No resume uploaded yet</span>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Subscription</Label>
              <div className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2.5">
                <Crown className={`h-5 w-5 ${profile?.subscription_tier === "premium" ? "text-amber-500" : "text-muted-foreground/40"}`} />
                <div className="flex-1">
                  <Badge variant={profile?.subscription_tier === "premium" ? "default" : "secondary"}>
                    {profile?.subscription_tier === "premium" ? "Premium" : "Free"}
                  </Badge>
                  {profile?.subscription && (
                    <span className="text-xs text-muted-foreground ml-2">
                      Expires {new Date(profile.subscription).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
