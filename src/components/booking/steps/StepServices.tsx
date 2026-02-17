
'use client'
import { useFormContext, useWatch } from 'react-hook-form'
import { Check } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import type { FC } from 'react'
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/src/components/ui/form'
import { cn } from '@/src/lib/utils'
import { SERVICES } from '@/src/lib/booking/constants'
import type { BookingFormValues } from '@/src/lib/booking/schema'
import { StepHeader } from '../ui/StepHeader'

// Dynamic icon lookup — avoids importing every icon individually
// Only icons listed in constants.ts are used, so tree-shaking still works
function ServiceIcon({ name, ...props }: { name: string } & LucideProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[name] as FC<LucideProps> | undefined
  if (!Icon) return null
  return <Icon {...props} />
}

export function StepServices() {
  const { control, setValue } = useFormContext<BookingFormValues>()
  const selectedServices = useWatch({ control, name: 'selectedServices' }) ?? []

  function toggleService(serviceId: string) {
    const updated = selectedServices.includes(serviceId)
      ? selectedServices.filter((id) => id !== serviceId)
      : [...selectedServices, serviceId]

    setValue('selectedServices', updated, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  return (
    <fieldset className="space-y-6 border-0 p-0">
      <legend className="sr-only">Select services</legend>

      <StepHeader
        title="Select Services"
        description="Choose all services you need. You can select multiple."
      />

      <FormField
        control={control}
        name="selectedServices"
        render={() => (
          <FormItem>
            {/* Error message when no services selected */}
            <FormControl>
              {/* Visually hidden but used by FormControl */}
              <input
                type="hidden"
                aria-hidden="true"
                value={selectedServices.join(',')}
                readOnly
              />
            </FormControl>
            <FormMessage className="mb-3" />

            <div
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
              role="group"
              aria-label="Available services"
            >
              {SERVICES.map((service) => {
                const isSelected = selectedServices.includes(service.id)
                return (
                  <button
                    key={service.id}
                    type="button"
                    role="checkbox"
                    aria-checked={isSelected}
                    aria-label={`${service.name}: ${service.description}`}
                    onClick={() => toggleService(service.id)}
                    className={cn(
                      'relative flex items-start gap-3 rounded-xl border-2 p-4 text-left',
                      'transition-all duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2',
                      isSelected
                        ? 'border-amber-500 bg-amber-500/8 shadow-sm shadow-amber-500/20'
                        : 'border-border bg-card hover:border-amber-500/40 hover:bg-muted/50',
                    )}
                  >
                    {/* Check indicator */}
                    <span
                      className={cn(
                        'absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all',
                        isSelected
                          ? 'border-amber-500 bg-amber-500'
                          : 'border-muted-foreground/30 bg-transparent',
                      )}
                      aria-hidden="true"
                    >
                      {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                    </span>

                    {/* Service icon */}
                    <span
                      className={cn(
                        'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                        isSelected ? 'bg-amber-500/20 text-amber-500' : 'bg-muted text-muted-foreground',
                      )}
                      aria-hidden="true"
                    >
                      <ServiceIcon name={service.icon} className="h-4 w-4" />
                    </span>

                    {/* Text */}
                    <div className="min-w-0 flex-1 pr-6">
                      <p
                        className={cn(
                          'text-sm font-semibold leading-tight',
                          isSelected ? 'text-foreground' : 'text-foreground',
                        )}
                      >
                        {service.name}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </FormItem>
        )}
      />

      {/* Selection count feedback */}
      {selectedServices.length > 0 && (
        <p
          className="text-sm font-medium text-amber-600 dark:text-amber-400"
          role="status"
          aria-live="polite"
        >
          {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </fieldset>
  )
}