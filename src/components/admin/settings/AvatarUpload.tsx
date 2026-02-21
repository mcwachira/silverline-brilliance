
"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Camera, User } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { uploadAvatar } from "@/src/app/actions/settings-actions";

interface AvatarUploadProps {
  currentUrl: string | null;
  name: string | null;
}

const MAX_SIZE_MB = 2;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function AvatarUpload({ currentUrl, name }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(null); // object URL for preview
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentUrl);
  const [error, setError] = useState<string | null>(null);

  // Compute initials for the fallback placeholder
  const initials = (name ?? "A")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // ── Step 1: User picks a file → show preview ─────────────────

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation (mirrors server validation)
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG, WebP, or GIF images are allowed.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_SIZE_MB} MB.`);
      return;
    }

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  }

  // ── Step 2: User confirms upload ─────────────────────────────

  function handleUpload() {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("avatar", file);

      const result = await uploadAvatar(formData);

      if (result.success && result.data) {
        // Replace preview with the persisted URL
        if (preview) {
          URL.revokeObjectURL(preview); // clean up blob URL
          setPreview(null);
        }
        setAvatarUrl(result.data);
        // Reset input so the same file can be re-selected later if needed
        if (inputRef.current) inputRef.current.value = "";
        toast.success("Avatar updated successfully!");
      } else {
        setError(result.error ?? "Upload failed. Please try again.");
        toast.error(result.error ?? "Upload failed");
      }
    });
  }

  function handleCancel() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const displaySrc = preview ?? avatarUrl;
  const isDirty    = !!preview;

  return (
    <div className="flex flex-col sm:flex-row items-start gap-5">
      {/* ── Avatar display ───────────────── */}
      <div className="relative flex-shrink-0">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-primary/20 border-2 border-[var(--border)] flex items-center justify-center">
          {displaySrc ? (
            <Image
              src={displaySrc}
              alt={name ?? "Avatar"}
              width={80}
              height={80}
              className="object-cover w-full h-full"
              // Unoptimized for Supabase Storage URLs with cache-busting query params
              unoptimized
            />
          ) : (
            <span className="text-xl font-bold text-primary/80 font-[family-name:var(--font-playfair)]">
              {initials}
            </span>
          )}
        </div>

        {/* Camera overlay button */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className={[
            "absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center",
            "bg-[var(--accent)] border-2 border-[var(--surface)] cursor-pointer",
            "hover:brightness-110 transition-all duration-150",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          ].join(" ")}
          aria-label="Change avatar"
        >
          {isPending
            ? <Loader2 className="w-3 h-3 animate-spin text-[var(--accent-foreground)]" />
            : <Camera className="w-3 h-3 text-[var(--accent-foreground)]" />
          }
        </button>
      </div>

      {/* ── Text & controls ──────────────── */}
      <div className="flex flex-col gap-2.5">
        <div>
          <p className="text-sm font-semibold text-[var(--text)]">Profile Photo</p>
          <p className="text-xs text-[var(--text-faint)] mt-0.5">
            JPG, PNG, WebP or GIF · Max {MAX_SIZE_MB} MB
          </p>
        </div>

        {/* Hidden input */}
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          className="sr-only"
          onChange={handleFileChange}
          disabled={isPending}
        />

        {isDirty ? (
          // Show Save / Cancel once a file is chosen
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              className="btn-primary gap-1.5 h-8"
              onClick={handleUpload}
              disabled={isPending}
            >
              {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
              {isPending ? "Uploading…" : "Save Photo"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="btn-ghost h-8"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="btn-secondary h-8 gap-1.5 w-fit"
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
          >
            <User className="w-3.5 h-3.5" />
            {avatarUrl ? "Change Photo" : "Upload Photo"}
          </Button>
        )}

        {/* Error */}
        {error && (
          <p className="text-xs text-[var(--destructive)] flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
      </div>
    </div>
  );
}