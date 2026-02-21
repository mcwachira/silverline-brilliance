
"use client";

import { useState, useTransition } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Loader2, Eye, EyeOff, CheckCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { changePassword } from "@/src/app/actions/settings-actions";

export function SecurityForm() {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [newPass, setNewPass]     = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showNew, setShowNew]     = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [errors, setErrors]       = useState<string[]>([]);

  function validate(): boolean {
    const errs: string[] = [];
    if (newPass.length < 8) errs.push("Password must be at least 8 characters.");
    if (!/[A-Z]/.test(newPass)) errs.push("Include at least one uppercase letter.");
    if (!/[0-9]/.test(newPass)) errs.push("Include at least one number.");
    if (newPass !== confirm)   errs.push("Passwords do not match.");
    setErrors(errs);
    return errs.length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    if (!validate()) return;

    startTransition(async () => {
      const result = await changePassword(newPass);
      if (result.success) {
        setSaved(true);
        setNewPass("");
        setConfirm("");
        toast.success("Password updated successfully");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(result.error ?? "Failed to update password");
      }
    });
  }

  const strength = newPass.length === 0 ? 0
    : newPass.length < 8        ? 1
    : newPass.length < 12 && !/[^a-zA-Z0-9]/.test(newPass) ? 2
    : 3;

  const strengthLabel = ["", "Weak", "Fair", "Strong"][strength];
  const strengthColor = ["", "bg-[var(--destructive)]", "bg-[var(--warning)]", "bg-[var(--success)]"][strength];

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">

      <div className="flex items-center gap-2.5 p-3.5 rounded-lg bg-[var(--info)]/8 border border-[var(--info)]/20 mb-2">
        <ShieldCheck className="w-4 h-4 text-[var(--info)] flex-shrink-0" />
        <p className="text-xs text-[var(--info)]">
          Use a strong, unique password you don't use elsewhere.
        </p>
      </div>

      {/* New password */}
      <div className="space-y-1.5">
        <Label htmlFor="new_password" className="label">New Password</Label>
        <div className="relative">
          <Input
            id="new_password"
            type={showNew ? "text" : "password"}
            className="input pr-10"
            value={newPass}
            onChange={(e) => { setNewPass(e.target.value); setErrors([]); }}
            placeholder="••••••••••••"
            autoComplete="new-password"
            disabled={isPending}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] hover:text-[var(--text)] transition-colors"
            onClick={() => setShowNew(v => !v)}
            tabIndex={-1}
          >
            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Strength meter */}
        {newPass.length > 0 && (
          <div className="space-y-1">
            <div className="flex gap-1 mt-2">
              {[1, 2, 3].map((level) => (
                <div
                  key={level}
                  className={[
                    "h-1 flex-1 rounded-full transition-colors duration-300",
                    strength >= level ? strengthColor : "bg-white/10",
                  ].join(" ")}
                />
              ))}
            </div>
            <p className={`text-[11px] ${["", "text-[var(--destructive)]", "text-[var(--warning)]", "text-[var(--success)]"][strength]}`}>
              {strengthLabel} password
            </p>
          </div>
        )}
      </div>

      {/* Confirm password */}
      <div className="space-y-1.5">
        <Label htmlFor="confirm_password" className="label">Confirm New Password</Label>
        <div className="relative">
          <Input
            id="confirm_password"
            type={showConf ? "text" : "password"}
            className={[
              "input pr-10",
              confirm.length > 0 && newPass !== confirm ? "border-[var(--destructive)]/60" : "",
            ].join(" ")}
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setErrors([]); }}
            placeholder="••••••••••••"
            autoComplete="new-password"
            disabled={isPending}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] hover:text-[var(--text)] transition-colors"
            onClick={() => setShowConf(v => !v)}
            tabIndex={-1}
          >
            {showConf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {confirm.length > 0 && newPass !== confirm && (
          <p className="text-[11px] text-[var(--destructive)]">Passwords do not match</p>
        )}
      </div>

      {/* Validation errors */}
      {errors.length > 0 && (
        <ul className="space-y-1">
          {errors.map((err) => (
            <li key={err} className="text-xs text-[var(--destructive)] flex items-center gap-1.5">
              <span>⚠</span> {err}
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-3 pt-1">
        <Button
          type="submit"
          className="btn-primary gap-2"
          disabled={isPending || !newPass || !confirm}
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isPending ? "Updating…" : "Update Password"}
        </Button>

        {saved && !isPending && (
          <span className="flex items-center gap-1.5 text-sm text-[var(--success)]">
            <CheckCircle className="w-4 h-4" /> Updated
          </span>
        )}
      </div>
    </form>
  );
}