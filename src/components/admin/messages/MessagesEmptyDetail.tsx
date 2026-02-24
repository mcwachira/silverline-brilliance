

import { MessageSquare } from "lucide-react";

export function MessagesEmptyDetail() {
  return (
    <div className="flex-1 hidden md:flex flex-col items-center justify-center gap-4
      rounded-xl border border-dashed border-[var(--border)] bg-white/[0.01]">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20
        flex items-center justify-center">
        <MessageSquare className="w-6 h-6 text-primary/50" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-[var(--text)]">Select a message</p>
        <p className="text-xs text-[var(--text-faint)] mt-1">
          Choose a conversation from the list to read it
        </p>
      </div>
    </div>
  );
}