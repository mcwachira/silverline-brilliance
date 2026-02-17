
'use client'

import { useEffect, useRef, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Zap, Loader2, CheckCircle2 } from 'lucide-react'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { Button } from '@/src/components/ui/button'
import { quickQuoteSchema } from '@/src/lib/booking/schema'
import type { QuickQuoteValues } from '@/src/lib/booking/schema'
import { SERVICES } from '@/src/lib/booking/constants'
import { submitQuoteRequest } from '@/src/app/(site)/booking/actions'
import { cn } from '@/src/lib/utils'

interface QuickQuoteModalProps {
  isOpen: boolean
  onClose: () => void
}

const MIN_DATE = new Date().toISOString().split('T')[0]

export function QuickQuoteModal({ isOpen, onClose }: QuickQuoteModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<QuickQuoteValues>({
    resolver: zodResolver(quickQuoteSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service: '',
      eventDate: '',
      message: '',
    },
  })

  const { formState: { isSubmitSuccessful, isSubmitting } } = form
  const isLoading = isSubmitting || isPending

  // ── Accessibility: focus trap, escape key, body scroll lock ──
  useEffect(() => {
    if (!isOpen) return

    const previouslyFocused = document.activeElement as HTMLElement
    // Focus the dialog on open
    dialogRef.current?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
      }
      // Basic focus trap
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      previouslyFocused?.focus()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  function handleClose() {
    onClose()
    // Reset form after close animation (150ms)
    setTimeout(() => form.reset(), 150)
  }

  function onSubmit(data: QuickQuoteValues) {
    startTransition(async () => {
      const result = await submitQuoteRequest(data)
      if (!result.success) {
        form.setError('root', { message: result.error })
      }
      // On success, isSubmitSuccessful = true → shows success state
    })
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        aria-hidden="true"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-quote-title"
        tabIndex={-1}
        className={cn(
          'fixed z-50 rounded-2xl border border-border bg-card shadow-2xl',
          'bottom-4 left-4 right-4',
          'sm:bottom-6 sm:left-auto sm:right-6 sm:w-[420px]',
          'max-h-[90dvh] overflow-y-auto outline-none',
          'focus-visible:ring-0', // dialog gets focused, not styled as button
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/15">
              <Zap className="h-4 w-4 text-amber-500" aria-hidden="true" />
            </div>
            <div>
              <h3 id="quick-quote-title" className="text-base font-bold text-foreground">
                Quick Quote
              </h3>
              <p className="text-xs text-muted-foreground">We'll respond within 24 hours</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close quick quote dialog"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {isSubmitSuccessful ? (
            // ── Success state ──────────────────────────────────
            <div className="flex flex-col items-center py-6 text-center">
              <CheckCircle2 className="mb-3 h-12 w-12 text-green-500" aria-hidden="true" />
              <h4 className="mb-1 text-lg font-bold text-foreground">Quote Request Sent!</h4>
              <p className="mb-6 text-sm text-muted-foreground">
                We'll review your request and reach out within 24 hours.
              </p>
              <div className="flex w-full gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => form.reset()}
                >
                  Send Another
                </Button>
                <Button
                  type="button"
                  className="flex-1 bg-amber-500 text-slate-950 hover:bg-amber-400"
                  onClick={handleClose}
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            // ── Form ──────────────────────────────────────────
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-3">

                {/* Root server error */}
                {form.formState.errors.root && (
                  <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                    {form.formState.errors.root.message}
                  </p>
                )}

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Your name"
                          autoComplete="name"
                          className="h-9 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Email + Phone */}
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          Email <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="you@email.com"
                            inputMode="email"
                            className="h-9 text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          Phone <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            placeholder="+254..."
                            inputMode="tel"
                            className="h-9 text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Service */}
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Service needed</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <FormControl>
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SERVICES.map((s) => (
                            <SelectItem key={s.id} value={s.name} className="text-sm">
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Preferred Date */}
                <FormField
                  control={form.control}
                  name="eventDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Preferred date</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          min={MIN_DATE}
                          className="h-9 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Quick message</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Tell us briefly about your event..."
                          rows={2}
                          className="resize-none text-sm"
                          maxLength={500}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="mt-1 w-full bg-amber-500 text-slate-950 hover:bg-amber-400 focus-visible:ring-amber-500 disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Sending...
                    </>
                  ) : (
                    'Request Quote'
                  )}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </>
  )
}