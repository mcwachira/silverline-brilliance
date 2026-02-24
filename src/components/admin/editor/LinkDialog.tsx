"use client"

import { useState, useEffect, useRef } from "react";
import { Link2, ExternalLink, X } from "lucide-react";


interface Props {
  isOpen: boolean;
  currentHref: string;
  onConfirm: (href: string) => void;
  onRemove: () => void;
  onClose: () => void;
}

export default function LinkDialog({
  isOpen,
  currentHref,
  onConfirm,
  onRemove,
  onClose,
}: Props) {
  const [href, setHref] = useState(currentHref);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHref(currentHref);
  }, [currentHref, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = href.trim();
    if (!url) return;
    const finalUrl =
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("mailto:")
        ? url
        : `https://${url}`;
    onConfirm(finalUrl);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className="absolute z-50 rounded-xl shadow-2xl overflow-hidden"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          width: "320px",
          boxShadow:
            "0 20px 60px oklch(0 0 0 / 0.5), 0 0 0 1px oklch(0.49 0.18 302 / 0.2)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <Link2
              className="w-4 h-4"
              style={{ color: "var(--accent)" }}
            />
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--text)" }}
            >
              {currentHref ? "Edit Link" : "Insert Link"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost p-1 rounded-lg"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label
              className="block text-xs font-medium mb-1.5"
              style={{ color: "var(--text-faint)" }}
            >
              URL
            </label>
            <input
              ref={inputRef}
              type="text"
              value={href}
              onChange={(e) => setHref(e.target.value)}
              placeholder="https://example.com"
              className="input text-sm w-full"
              onKeyDown={(e) => {
                if (e.key === "Escape") onClose();
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="btn-primary flex-1 text-sm py-2"
              disabled={!href.trim()}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {currentHref ? "Update" : "Insert"}
            </button>
            {currentHref && (
              <button
                type="button"
                onClick={onRemove}
                className="btn-danger text-sm py-2 px-3"
              >
                Remove
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}