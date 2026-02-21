"use client";

import { useState, useTransition } from "react";
import { Button } from "@/src/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { updateNotifications } from "@/src/app/actions/settings-actions";
import type { NotificationSettings } from "@/types/admin";

interface NotificationsFormProps {
  settings: NotificationSettings;
}

const NOTIF_OPTIONS: {
  key: keyof NotificationSettings;
  label: string;
  description: string;
}[] = [
  {
    key: "new_booking",
    label: "New Booking Request",
    description: "Get notified when someone submits a new booking form.",
  },
  {
    key: "booking_confirmed",
    label: "Booking Confirmed",
    description: "When you confirm a booking for a client.",
  },
  {
    key: "new_message",
    label: "New Contact Message",
    description: "When a visitor sends a message via the contact form.",
  },
  {
    key: "email_digest",
    label: "Daily Email Digest",
    description: "Receive a daily summary of all dashboard activity.",
  },
];

export function NotificationsForm({ settings }: NotificationsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [values, setValues] = useState<NotificationSettings>({ ...settings });

  function toggle(key: keyof NotificationSettings) {
    setValues((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    startTransition(async () => {
      const result = await updateNotifications(values);
      if (result.success) {
        setSaved(true);
        toast.success("Notification preferences saved");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(result.error ?? "Failed to save preferences");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-1">
      {NOTIF_OPTIONS.map(({ key, label, description }, i) => (
        <div
          key={key}
          className={[
            "flex items-center justify-between gap-4 py-4",
            i < NOTIF_OPTIONS.length - 1 ? "border-b border-[var(--border)]" : "",
          ].join(" ")}
        >
          <div>
            <p className="text-sm font-medium text-[var(--text)]">{label}</p>
            <p className="text-xs text-[var(--text-faint)] mt-0.5">{description}</p>
          </div>

          {/* Toggle switch */}
          <button
            type="button"
            role="switch"
            aria-checked={values[key]}
            onClick={() => toggle(key)}
            disabled={isPending}
            className={[
              "relative w-10 h-[22px] rounded-full transition-colors duration-200 flex-shrink-0",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              values[key]
                ? "bg-[var(--accent)]"
                : "bg-white/10 border border-white/15",
            ].join(" ")}
          >
            <span
              className={[
                "absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow-sm",
                "transition-transform duration-200",
                values[key] ? "translate-x-[18px]" : "translate-x-0",
              ].join(" ")}
            />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-3 pt-4">
        <Button type="submit" className="btn-primary gap-2" disabled={isPending}>
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isPending ? "Saving…" : "Save Preferences"}
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