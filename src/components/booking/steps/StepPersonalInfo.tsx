
'use client'
import { useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import type { BookingFormValues } from '@/src/lib/booking/schema'
import { StepHeader } from '../ui/StepHeader'

export function StepPersonalInfo() {
  const { control } = useFormContext<BookingFormValues>()

  return (
    <fieldset className="space-y-6 border-0 p-0">
      <legend className="sr-only">Your personal details</legend>

      <StepHeader
        title="Your Details"
        description="How we'll reach you to confirm your booking."
      />

      {/* Full Name */}
      <FormField
        control={control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Full Name <span className="text-destructive" aria-hidden="true">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                id="fullName"
                type="text"
                autoComplete="name"
                placeholder="Jane Smith"
                aria-required="true"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Email + Phone side by side on md+ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email Address <span className="text-destructive" aria-hidden="true">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="jane@company.com"
                  aria-required="true"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Phone Number <span className="text-destructive" aria-hidden="true">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="+254 712 345 678"
                  aria-required="true"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Company — optional */}
      <FormField
        control={control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company / Organisation</FormLabel>
            <FormControl>
              <Input
                {...field}
                id="company"
                type="text"
                autoComplete="organization"
                placeholder="Acme Events Ltd (optional)"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </fieldset>
  )
}