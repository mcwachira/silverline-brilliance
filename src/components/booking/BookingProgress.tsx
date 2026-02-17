'use client'

import { Check } from 'lucide-react'
import { cn } from '@/src/lib/utils'
import { STEP_LABELS, TOTAL_STEPS } from '@/src/lib/booking/constants'

interface BookingProgressProps {
  currentStep: number
}

export function BookingProgress({ currentStep }: BookingProgressProps) {
  const progressPercent = Math.round(((currentStep - 1) / (TOTAL_STEPS - 1)) * 100)

  return (
    <div className="mb-8" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={TOTAL_STEPS} aria-label={`Step ${currentStep} of ${TOTAL_STEPS}: ${STEP_LABELS[currentStep - 1]}`}>
      {/* Progress line */}
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-amber-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-between">
        {STEP_LABELS.map((label, index) => {
          const stepNum = index + 1
          const isCompleted = stepNum < currentStep
          const isActive = stepNum === currentStep
          const isPending = stepNum > currentStep

          return (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5"
              aria-current={isActive ? 'step' : undefined}
            >
              {/* Dot */}
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300',
                  isCompleted && 'border-amber-500 bg-amber-500 text-white',
                  isActive && 'border-amber-500 bg-background text-amber-500 shadow-[0_0_0_4px_hsl(var(--amber-500)/0.15)]',
                  isPending && 'border-muted bg-background text-muted-foreground',
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <span>{stepNum}</span>
                )}
              </div>

              {/* Label — visible on sm+ */}
              <span
                className={cn(
                  'hidden text-[10px] font-medium sm:block',
                  isActive && 'text-amber-500',
                  isCompleted && 'text-foreground',
                  isPending && 'text-muted-foreground',
                )}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}