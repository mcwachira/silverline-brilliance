'use client'
import { Check } from 'lucide-react'
import { cn } from '@/src/lib/utils'
import { STEP_LABELS, TOTAL_STEPS } from '@/src/lib/booking/constants'

interface BookingProgressProps {
  currentStep: number
  totalSteps?: number
}

export function BookingProgress({ currentStep, totalSteps = TOTAL_STEPS }: BookingProgressProps) {
  const progressPercent = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)

  return (
    <div className="mb-8" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps} aria-label={`Step ${currentStep} of ${totalSteps}: ${STEP_LABELS[currentStep - 1]}`}>
      {/* Progress line */}
      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500 ease-out"
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
                  isCompleted && 'border-purple-400 bg-purple-500 text-white shadow-lg shadow-purple-500/50',
                  isActive && 'border-purple-400 bg-slate-900 text-purple-300 ring-4 ring-purple-500/20',
                  isPending && 'border-slate-700 bg-slate-800 text-slate-500',
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
                  isActive && 'text-purple-300',
                  isCompleted && 'text-purple-400',
                  isPending && 'text-slate-500',
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
