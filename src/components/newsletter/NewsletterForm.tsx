// components/newsletter/NewsletterForm.tsx
'use client'
// ─────────────────────────────────────────────────────────────
// Newsletter subscription form with React Hook Form + Zod
//
// Features:
//   • Two variants: 'default' (full) and 'compact' (inline)
//   • Server Action submission via useTransition
//   • Graceful duplicate email handling
//   • Success state with auto-reset
//   • Accessible form patterns
//   • No Framer Motion — pure CSS transitions
// ─────────────────────────────────────────────────────────────
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Loader2, Check, AlertCircle } from 'lucide-react'
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import { newsletterSchema } from '@/src/lib/newsletter/schema'
import type { NewsletterFormValues } from '@/src/lib/newsletter/schema'
import { subscribeToNewsletter } from '@/src/app/newsletter/actions'
import { cn } from '@/src/lib/utils'

interface NewsletterFormProps {
  variant?: 'default' | 'compact'
  source?: string // e.g., 'footer', 'blog_post', 'modal'
  className?: string
}

export function NewsletterForm({
  variant = 'default',
  source = 'website',
  className,
}: NewsletterFormProps) {
  const [isSuccess, setIsSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
    },
  })

  const { formState: { isSubmitting } } = form
  const isLoading = isSubmitting || isPending

  function onSubmit(data: NewsletterFormValues) {
    startTransition(async () => {
      const result = await subscribeToNewsletter(data, source)

      if (!result.success) {
        // Handle duplicate gracefully (show as success to avoid email enumeration)
        if (result.isDuplicate) {
          setIsSuccess(true)
          form.reset()
          setTimeout(() => setIsSuccess(false), 5000)
        } else {
          // Show actual error
          form.setError('email', {
            type: 'server',
            message: result.error,
          })
        }
        return
      }

      // Success
      setIsSuccess(true)
      form.reset()
      // Auto-reset success state after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000)
    })
  }

  // ── Compact Variant ──────────────────────────────────────────
  if (variant === 'compact') {
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn('flex flex-col gap-2 sm:flex-row', className)}
          noValidate
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      {...field}
                      id={`newsletter-email-${source}`}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="Enter your email"
                      aria-label="Email address for newsletter"
                      aria-invalid={!!fieldState.error}
                      aria-describedby={
                        fieldState.error
                          ? `newsletter-error-${source}`
                          : undefined
                      }
                      disabled={isLoading}
                      className={cn(
                        'pl-10',
                        fieldState.error && 'border-destructive focus-visible:ring-destructive',
                      )}
                    />
                  </div>
                </FormControl>
                <FormMessage id={`newsletter-error-${source}`} className="text-xs" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading || isSuccess}
            className={cn(
              'shrink-0 transition-all',
              isSuccess && 'bg-green-600 hover:bg-green-600',
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : isSuccess ? (
              <>
                <Check className="mr-2 h-4 w-4" aria-hidden="true" />
                Subscribed!
              </>
            ) : (
              'Subscribe'
            )}
          </Button>
        </form>
      </Form>
    )
  }

  // ── Default Variant ──────────────────────────────────────────
  return (
    <div className={cn('space-y-4', className)}>
      {isSuccess ? (
        // Success state
        <div
          role="status"
          aria-live="polite"
          className="flex items-start gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400"
        >
          <Check className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">You're subscribed!</p>
            <p className="mt-0.5 text-xs opacity-90">
              Check your inbox for a welcome email.
            </p>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3"
            noValidate
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <div className="relative flex-1">
                        <Mail
                          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <Input
                          {...field}
                          id={`newsletter-email-full-${source}`}
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          placeholder="Enter your email address"
                          aria-label="Email address for newsletter"
                          aria-invalid={!!fieldState.error}
                          aria-describedby={
                            fieldState.error
                              ? `newsletter-error-full-${source}`
                              : 'newsletter-description'
                          }
                          disabled={isLoading}
                          className={cn(
                            'h-12 pl-12 text-base',
                            fieldState.error && 'border-destructive focus-visible:ring-destructive',
                          )}
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={isLoading}
                        className="h-12 shrink-0 px-8"
                      >
                        {isLoading ? (
                          <>
                            <Loader2
                              className="mr-2 h-4 w-4 animate-spin"
                              aria-hidden="true"
                            />
                            Subscribing...
                          </>
                        ) : (
                          'Subscribe Now'
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage
                    id={`newsletter-error-full-${source}`}
                    className="flex items-center gap-1.5 text-xs"
                  >
                    {fieldState.error && (
                      <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                  </FormMessage>
                </FormItem>
              )}
            />

            <p
              id="newsletter-description"
              className="text-center text-xs text-muted-foreground sm:text-left"
            >
              Get the latest news and updates delivered to your inbox. No spam,
              unsubscribe anytime.
            </p>
          </form>
        </Form>
      )}
    </div>
  )
}