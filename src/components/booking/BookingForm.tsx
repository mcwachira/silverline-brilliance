
'use client'

import { useCallback, useState, useTransition } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { Card, CardContent } from '@/src/components/ui/card'
import { BookingProgress } from './BookingProgress'
import { BookingConfirmation } from './BookingConfirmation'
import { StepPersonalInfo } from './steps/StepPersonalInfo'
import { StepEventInfo } from './steps/StepEventInfo'
import { StepServices } from './steps/StepServices'
import { StepAdditional } from './steps/StepAdditional'
import { submitBooking } from '@/src/app/(site)/booking/actions'
import { bookingSchema, STEP_FIELDS } from '@/src/lib/booking/schema'
import type { BookingFormValues } from '@/src/lib/booking/schema'
import { TOTAL_STEPS } from '@/src/lib/booking/constants'

const STEP_COMPONENTS = [StepPersonalInfo, StepEventInfo, StepServices, StepAdditional]

export function BookingForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingReference, setBookingReference] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const methods = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    // Validate on blur (not on every keystroke) to avoid layout thrash
    // but re-validate onChange after the first submit attempt
    mode: 'onTouched',
    defaultValues: {
      preferredContact: 'email',
      expectedAttendees: 50,
      selectedServices: [],
      company: '',
      eventTypeOther: '',
      venueAddress: '',
      specialRequirements: '',
      budgetRange: '',
      howHeard: '',
      eventEndTime: '',
    },
  })

  const {
    handleSubmit,
    trigger,
    setError,
    formState: { isSubmitting },
  } = methods

  const isLoading = isSubmitting || isPending

  // ── Step Navigation ──────────────────────────────────────────
  const goToNext = useCallback(async () => {
    setServerError(null)
    // Only validate fields that belong to the current step
    const fieldsToValidate = STEP_FIELDS[currentStep]
    const isStepValid = await trigger(fieldsToValidate)
    if (isStepValid && currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1)
      // Scroll to top of form on step change (important on mobile)
      document
        .getElementById('booking-form-top')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [currentStep, trigger])

  const goToPrev = useCallback(() => {
    setServerError(null)
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1)
      document
        .getElementById('booking-form-top')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [currentStep])

  // ── Form Submit ──────────────────────────────────────────────
  const onSubmit = useCallback((data: BookingFormValues) => {
    setServerError(null)
    startTransition(async () => {
      const result = await submitBooking(data)

      if (result.success) {
        setBookingReference(result.bookingReference)
        return
      }

      // Map field-level server errors back into RHF
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, messages]) => {
          if (messages?.[0]) {
            setError(field as keyof BookingFormValues, {
              type: 'server',
              message: messages[0],
            })
          }
        })
      }

      setServerError(result.error)
    })
  }, [setError])

  // ── Success State ────────────────────────────────────────────
  if (bookingReference) {
    return <BookingConfirmation bookingReference={bookingReference} />
  }

  const CurrentStepComponent = STEP_COMPONENTS[currentStep - 1]

  return (
    <Card
      className="border-border/50 shadow-xl"
      id="booking-form-top"
    >
      <CardContent className="p-6 md:p-8 lg:p-10">
        {/* Progress indicator */}
        <BookingProgress currentStep={currentStep} />

        {/* Server-level error banner */}
        {serverError && (
          <Alert variant="destructive" className="mb-6" role="alert">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        {/* Step content */}
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-label={`Booking form — step ${currentStep} of ${TOTAL_STEPS}`}
          >
            {/* Min-height prevents layout shift between steps */}
            <div className="min-h-[420px] sm:min-h-[460px]">
              <CurrentStepComponent />
            </div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={goToPrev}
                disabled={currentStep === 1 || isLoading}
                aria-label="Go to previous step"
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              {currentStep < TOTAL_STEPS ? (
                <Button
                  type="button"
                  onClick={goToNext}
                  disabled={isLoading}
                  aria-label="Go to next step"
                  className="gap-2 bg-amber-500 text-slate-950 hover:bg-amber-400 focus-visible:ring-amber-500"
                >
                  Next
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  aria-label={isLoading ? 'Submitting your booking request' : 'Submit booking request'}
                  className="min-w-[180px] gap-2 bg-amber-500 text-slate-950 hover:bg-amber-400 focus-visible:ring-amber-500"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Booking Request'
                  )}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}