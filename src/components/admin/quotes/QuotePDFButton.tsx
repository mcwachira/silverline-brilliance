
"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Quote } from "@/types/admin";

interface QuotePDFButtonProps {
  quote: Quote;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export function QuotePDFButton({
  quote,
  variant = "default",
  size = "default",
}: QuotePDFButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    try {
      setLoading(true);

      // Dynamic import — keeps @react-pdf/renderer out of the SSR bundle.
      const { downloadQuotePDF } = await import("@/src/lib/pdf/quote-pdf");
      await downloadQuotePDF(quote);

      toast.success("PDF downloaded successfully");
    } catch (err) {
      console.error("[PDF] generation error:", err);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={loading}
      className="btn-primary gap-2"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {loading ? "Generating…" : "Download PDF"}
    </Button>
  );
}