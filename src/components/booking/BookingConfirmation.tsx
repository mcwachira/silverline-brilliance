
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Copy, Check, ArrowLeft, ExternalLink } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import { cn } from '@/src/lib/utils'

interface BookingConfirmationProps {
  bookingReference: string
}

const NEXT_STEPS = [
  {
    step: '1',
    title: 'Confirmation email sent',
    description: "Check your inbox — we've sent a copy of your request.",
  },
  {
    step: '2',
    title: 'Team review (within 24 hours)',
    description: 'A senior team member will review your requirements personally.',
  },
  {
    step: '3',
    title: 'Itemised quote delivered',
    description: "You'll receive a detailed, no-obligation quote via your preferred channel.",
  },
  {
    step: '4',
    title: 'Booking confirmed',
    description: 'Once approved, your date is secured with a written agreement.',
  },
] as const

export function BookingConfirmation({ bookingReference }: BookingConfirmationProps) {
  const [copied, setCopied] = useState(false)

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(bookingReference)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback for non-secure contexts
      const el = document.createElement('textarea')
      el.value = bookingReference
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <Card className="border-border/50 shadow-xl">
      <CardContent className="p-6 text-center md:p-10">

        {/* Success icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 ring-8 ring-green-500/10">
            <CheckCircle2
              className="h-10 w-10 text-green-500"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Heading */}
        <h2 className="mb-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          Booking Request Received!
        </h2>
        <p className="mb-8 text-muted-foreground">
          Thank you — our team will review your request and contact you within{' '}
          <strong className="text-foreground">24 hours</strong>.
        </p>

        {/* Reference number */}
        <div className="mb-8 inline-block">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Your Booking Reference
          </p>
          <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 px-5 py-3">
            <span className="font-mono text-2xl font-bold tracking-wider text-amber-500">
              {bookingReference}
            </span>
            <button
              type="button"
              onClick={copyReference}
              aria-label={copied ? 'Reference copied' : 'Copy booking reference to clipboard'}
              className={cn(
                'ml-1 rounded-md p-1.5 transition-colors',
                copied
                  ? 'text-green-500'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {copied ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {copied && (
            <p className="mt-1.5 text-xs font-medium text-green-500" role="status" aria-live="polite">
              Copied to clipboard
            </p>
          )}
        </div>

        {/* What happens next */}
        <div className="mb-8 rounded-xl border border-border bg-muted/30 p-5 text-left">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            What happens next
          </h3>
          <ol className="space-y-4">
            {NEXT_STEPS.map(({ step, title, description }) => (
              <li key={step} className="flex items-start gap-3">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-500"
                  aria-hidden="true"
                >
                  {step}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="outline" asChild className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/portfolio">
              View Our Work
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        {/* Contact fallback */}
        <p className="mt-6 text-xs text-muted-foreground">
          Questions? Email{' '}
          <a
            href="mailto:bookings@silverlinebrilliance.com"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            bookings@silverlinebrilliance.com
          </a>{' '}
          and quote your reference number.
        </p>
      </CardContent>
    </Card>
  )
}