"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Send, Loader2, CheckCircle, User, Mail,
  Phone, MessageSquare, ChevronDown,
} from "lucide-react";
import {
  ContactSchema,
  type ContactFormValues,
} from "@/src/lib/validation/contact";
import { submitContactForm } from "@/src/app/actions/contact-actions";

const SERVICES = [
  "Live Streaming",
  "Event Coverage",
  "Photography",
  "Stage & Lighting",
  "Sound Setup",
  "Full Production Package",
  "Other / General Enquiry",
];

const HOW_HEARD = [
  "Google Search",
  "Social Media",
  "Referral / Word of Mouth",
  "Previous Client",
  "Other",
];

export default function ContactForm() {
  const [reference, setReference] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      service: "",
      how_heard: "",
    },
  });

  const messageLength = watch("message")?.length ?? 0;

  async function onSubmit(data: ContactFormValues) {
    const result = await submitContactForm(data);

    if (result.success && result.reference) {
      setReference(result.reference);
      reset();
      toast.success("Message sent successfully!");
    } else {
      toast.error(result.error ?? "Something went wrong. Please try again.");
    }
  }

  // ── Success state ─────────────────────────────────────────────
  if (reference) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-2xl p-12 flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-500/40 flex items-center justify-center mb-6"
        >
          <CheckCircle className="w-10 h-10 text-green-400" />
        </motion.div>

        <h3 className="font-heading font-black text-2xl text-gradient-gold mb-3">
          Message Sent!
        </h3>
        <p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">
          We've received your message and will get back to you within{" "}
          <strong className="text-foreground">24–48 business hours</strong>.
        </p>

        <div className="bg-accent/10 border border-accent/25 rounded-xl px-8 py-4 mb-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Reference Number
          </p>
          <p className="font-heading font-black text-2xl text-accent tracking-widest">
            {reference}
          </p>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          A confirmation email has been sent to your inbox.
        </p>

        <button
          onClick={() => setReference(null)}
          className="text-sm text-accent hover:text-foreground transition-colors hover:underline underline-offset-4"
        >
          Send another message →
        </button>
      </motion.div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass-card rounded-2xl p-8"
    >
      <div className="mb-8">
        <h2 className="font-heading font-black text-2xl text-foreground mb-1">
          Send Us a Message
        </h2>
        <p className="text-muted-foreground text-sm">
          We&apos;ll get back to you within 24–48 hours
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

        {/* Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" icon={User} error={errors.full_name?.message} required>
            <input
              {...register("full_name")}
              placeholder="John Kamau"
              className={inputCls(!!errors.full_name)}
            />
          </Field>

          <Field label="Email Address" icon={Mail} error={errors.email?.message} required>
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className={inputCls(!!errors.email)}
            />
          </Field>
        </div>

        {/* Phone + Service */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone Number" icon={Phone} error={errors.phone?.message}>
            <input
              {...register("phone")}
              type="tel"
              placeholder="0700 040 225"
              className={inputCls(!!errors.phone)}
            />
          </Field>

          <Field label="Service of Interest" icon={ChevronDown}>
            <div className="relative">
              <select
                {...register("service")}
                className={`${inputCls(false)} appearance-none pr-9`}
              >
                <option value="">Select a service...</option>
                {SERVICES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </Field>
        </div>

        {/* Subject */}
        <Field label="Subject" icon={MessageSquare} error={errors.subject?.message} required>
          <input
            {...register("subject")}
            placeholder="What's this regarding?"
            className={inputCls(!!errors.subject)}
          />
        </Field>

        {/* Message */}
        <Field label="Message" icon={MessageSquare} error={errors.message?.message} required>
          <div className="relative">
            <textarea
              {...register("message")}
              rows={5}
              maxLength={3000}
              placeholder="Tell us about your event, requirements, or any questions you have..."
              className={`${inputCls(!!errors.message)} resize-none`}
            />
            <span
              className={`absolute bottom-2.5 right-3 text-xs transition-colors ${
                messageLength > 2500 ? "text-yellow-500" : "text-muted-foreground"
              }`}
            >
              {messageLength}/3000
            </span>
          </div>
        </Field>

        {/* How did you hear */}
        <Field label="How did you find us?" icon={ChevronDown}>
          <div className="relative">
            <select
              {...register("how_heard")}
              className={`${inputCls(false)} appearance-none pr-9`}
            >
              <option value="">Select an option...</option>
              {HOW_HEARD.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </Field>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-heading font-bold tracking-wide transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
          ) : (
            <><Send className="w-4 h-4" /> Send Message</>
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          By submitting you agree to our{" "}
          <a href="/privacy" className="text-accent hover:underline underline-offset-4">
            Privacy Policy
          </a>
          . We never share your information.
        </p>

      </form>
    </motion.div>
  );
}

// ── Helper: input class ────────────────────────────────────────
function inputCls(hasError: boolean) {
  return [
    "w-full rounded-lg px-4 py-2.5 text-sm",
    "bg-secondary/50 text-foreground placeholder:text-muted-foreground",
    "border transition-all duration-150",
    "focus:outline-none focus:ring-2",
    hasError
      ? "border-red-500/60 focus:ring-red-500/20 focus:border-red-500/80"
      : "border-border focus:ring-accent/20 focus:border-accent",
  ].join(" ");
}

// ── Helper: field wrapper ──────────────────────────────────────
function Field({
  label,
  icon: Icon,
  error,
  required,
  children,
}: {
  label: string;
  icon: React.ElementType;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
        <Icon className="w-3.5 h-3.5 text-accent" />
        {label}
        {required && <span className="text-accent ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400 flex items-center gap-1"
        >
          <span>⚠</span> {error}
        </motion.p>
      )}
    </div>
  );
}