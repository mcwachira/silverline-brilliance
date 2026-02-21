"use server";

import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { AdminProfile, NotificationSettings, ActionResult } from "@/types/admin";

// ── Get current admin profile ────────────────────────────────────

export async function getAdminProfile(): Promise<ActionResult<AdminProfile>> {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, error: "Unauthorised" };

  const { data, error } = await supabase
    .from("admin_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: { ...data, email: user.email! } as AdminProfile };
}

// ── Update profile (name, phone) ─────────────────────────────────

export async function updateProfile(
  full_name: string,
  phone: string | null
): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorised" };

  const { error } = await supabase
    .from("admin_profiles")
    .update({ full_name, phone, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/settings");
  return { success: true };
}

// ── Upload avatar to Supabase Storage ────────────────────────────
// Called from the client via a server action that accepts FormData.
// The file is uploaded to the 'avatars' bucket under the user's id.
// Any existing avatar is overwritten (upsert: true).

export async function uploadAvatar(formData: FormData): Promise<ActionResult<string>> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorised" };

  const file = formData.get("avatar") as File | null;
  if (!file || file.size === 0) return { success: false, error: "No file provided" };

  // Validate type
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type))
    return { success: false, error: "File type not allowed. Use JPG, PNG, WebP, or GIF." };

  // 2 MB limit
  if (file.size > 2 * 1024 * 1024)
    return { success: false, error: "File must be under 2 MB." };

  // Derive extension from MIME type
  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const path = `${user.id}/avatar.${ext}`;

  const bytes = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, bytes, {
      contentType: file.type,
      upsert: true,          // overwrite previous avatar
      cacheControl: "3600",
    });

  if (uploadError) return { success: false, error: uploadError.message };

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from("avatars")
    .getPublicUrl(path);

  // Bust cache: append timestamp so the browser refetches the new image
  const avatarUrl = `${publicUrl}?t=${Date.now()}`;

  // Persist URL in admin_profiles
  const { error: updateError } = await supabase
    .from("admin_profiles")
    .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (updateError) return { success: false, error: updateError.message };

  revalidatePath("/dashboard/settings");
  return { success: true, data: avatarUrl };
}

// ── Update notification settings ─────────────────────────────────

export async function updateNotifications(
  settings: NotificationSettings
): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorised" };

  const { error } = await supabase
    .from("admin_profiles")
    .update({
      notification_settings: settings,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/settings");
  return { success: true };
}

// ── Change password (via Supabase Auth) ──────────────────────────

export async function changePassword(
  newPassword: string
): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorised" };

  if (newPassword.length < 8)
    return { success: false, error: "Password must be at least 8 characters." };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { success: false, error: error.message };
  return { success: true };
}
