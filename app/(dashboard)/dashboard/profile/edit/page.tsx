"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { userApi } from "@/lib/users";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditProfilePage() {
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userApi.getProfile(),
    staleTime: 30_000,
  });

  const updateProfile = useMutation({
    mutationFn: (data: { name?: string; phone_number?: string }) => userApi.update(data),
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      if (name) setUser({ ...useAuthStore.getState().user!, name });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <>
      <Link href="/dashboard/profile" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Profile
      </Link>
      <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Edit Profile</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Update your personal information.</p>

      <div className="max-w-xl space-y-4">
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input value={name || profileData?.user?.name || ""} onChange={(e) => setName(e.target.value)} className="rounded-lg" />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input value={phone || profileData?.user?.phone_number || ""} onChange={(e) => setPhone(e.target.value)} className="rounded-lg" />
        </div>
        <Button
          onClick={() => updateProfile.mutate({ name: name || undefined, phone_number: phone || undefined })}
          disabled={updateProfile.isPending}
          className="rounded-lg"
        >
          {updateProfile.isPending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </>
  );
}
