
'use client'

import { useCallback, useState, useTransition } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { toast } from 'sonner'
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

       if (!isStepValid) {
      toast.error('Please fill in all required fields correctly')
      return
    }

     if (currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1)
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
const handleFinalSubmit = useCallback(async () => {
    setServerError(null)
    
    // Final validation of all steps
    const allFieldsValid = await trigger()
    if (!allFieldsValid) {
      toast.error('Please review all steps and fill in required fields')
      return
    }

    const formData = methods.getValues()
    
    startTransition(async () => {
      const result = await submitBooking(formData)

      if (result.success) {
        setBookingReference(result.bookingReference)
        toast.success('Booking request submitted successfully!', {
          description: `Your reference: ${result.bookingReference}`,
          duration: 5000,
        })
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
      toast.error('Submission failed', {
        description: result.error,
      })
    })
  }, [methods, setError, trigger])


  // ── Success State ────────────────────────────────────────────
  if (bookingReference) {
    return <BookingConfirmation bookingReference={bookingReference} />
  }

  const CurrentStepComponent = STEP_COMPONENTS[currentStep - 1]

   return (
    <Card
      className="border-border/50 bg-slate-900/50 shadow-xl backdrop-blur-sm"
      id="booking-form-top"
    >
      <CardContent className="p-6 md:p-8 lg:p-10">
        {/* Progress indicator */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {currentStep === 1 && 'Your Details'}
            {currentStep === 2 && 'Event Info'}
            {currentStep === 3 && 'Services'}
            {currentStep === 4 && 'Final Details'}
          </h2>
          <span className="text-sm font-medium text-purple-400">
            Step {currentStep}/{TOTAL_STEPS}
          </span>
        </div>

        <BookingProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        {/* Server-level error banner */}
        {serverError && (
          <Alert variant="destructive" className="mb-6" role="alert">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        {/* Step content — NOT wrapped in <form> to prevent auto-submit */}
        <FormProvider {...methods}>
          <div className="min-h-[420px] sm:min-h-[460px]">
            <CurrentStepComponent />
          </div>

          {/* Navigation — Submit button is type="button" to prevent auto-submit */}
          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={goToPrev}
              disabled={currentStep === 1 || isLoading}
              aria-label="Go to previous step"
              className="gap-2 border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
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
                className="gap-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 focus-visible:ring-purple-500"
              >
                Next
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isLoading}
                aria-label={isLoading ? 'Submitting your booking request' : 'Submit booking request'}
                className="min-w-[180px] gap-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 focus-visible:ring-purple-500"
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
        </FormProvider>

        {/* Privacy Note */}
        <div className="mt-6 rounded-lg bg-purple-500/10 px-4 py-3">
          <p className="text-xs text-purple-300">
            <span className="font-semibold">Privacy Note:</span> Your information is kept
            confidential and will only be used to respond to your booking request.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
