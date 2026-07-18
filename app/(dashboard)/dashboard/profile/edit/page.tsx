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
      <Link href="/dashboard/profile" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Profile
      </Link>
      <h1 className="font-display text-2xl font-bold tracking-tight mb-1">Edit Profile</h1>
      <p className="text-sm text-muted-foreground mb-6">Update your personal information.</p>

      <div className="max-w-xl space-y-4">
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input value={name || profileData?.user?.name || ""} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input value={phone || profileData?.user?.phone_number || ""} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <Button
          onClick={() => updateProfile.mutate({ name: name || undefined, phone_number: phone || undefined })}
          disabled={updateProfile.isPending}
        >
          {updateProfile.isPending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </>
  );
}
