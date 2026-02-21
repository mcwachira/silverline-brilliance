
"use client";

import { useState, useTransition } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { updateProfile } from "@/src/app/actions/settings-actions";
import type { AdminProfile } from "@/types/admin";

interface ProfileFormProps {
  profile: AdminProfile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [phone,    setPhone]    = useState(profile.phone ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);

    startTransition(async () => {
      const result = await updateProfile(
        fullName.trim(),
        phone.trim() || null
      );

      if (result.success) {
        setSaved(true);
        toast.success("Profile updated successfully");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(result.error ?? "Failed to update profile");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="full_name" className="label">Full Name</Label>
          <Input
            id="full_name"
            className="input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            required
            minLength={2}
            maxLength={100}
            disabled={isPending}
          />
        </div>

        {/* Email (read-only) */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="label">Email Address</Label>
          <Input
            id="email"
            className="input opacity-60 cursor-not-allowed"
            value={profile.email}
            disabled
            readOnly
          />
          <p className="text-[11px] text-[var(--text-faint)]">
            Changing email requires identity verification via Supabase Auth.
          </p>
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="label">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            className="input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+254 700 040 225"
            disabled={isPending}
          />
        </div>

        {/* Role (read-only) */}
        <div className="space-y-1.5">
          <Label htmlFor="role" className="label">Role</Label>
          <Input
            id="role"
            className="input opacity-60 cursor-not-allowed capitalize"
            value={profile.role.replace("_", " ")}
            disabled
            readOnly
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <Button
          type="submit"
          className="btn-primary gap-2"
          disabled={isPending}
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isPending ? "Saving…" : "Save Changes"}
        </Button>

        {saved && !isPending && (
          <span className="flex items-center gap-1.5 text-sm text-[var(--success)]">
            <CheckCircle className="w-4 h-4" /> Saved
          </span>
        )}
      </div>
    </form>
  );
}