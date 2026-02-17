'use client'
import { useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/src/components/ui/form'
import { Textarea } from '@/src/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/radio-group'
import { Label } from '@/src/components/ui/label'
import { Mail, Phone, MessageCircle } from 'lucide-react'
import type { BookingFormValues } from '@/src/lib/booking/schema'
import {
  BUDGET_RANGES,
  HOW_HEARD_OPTIONS,
  PREFERRED_CONTACT_OPTIONS,
} from '@/src/lib/booking/constants'
import { StepHeader } from '../ui/StepHeader'

export function StepAdditional() {
  const { control } = useFormContext<BookingFormValues>()

  const contactIcons = {
    email: Mail,
    phone: Phone,
    whatsapp: MessageCircle,
  } as const

  return (
    <fieldset className="space-y-6 border-0 p-0">
      <legend className="sr-only">Additional booking details</legend>

      <StepHeader
        title="Final Details"
        description="Almost done. These details help us prepare the perfect proposal for you."
      />

      {/* Special Requirements */}
      <FormField
        control={control}
        name="specialRequirements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Special Requirements</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                id="specialRequirements"
                placeholder="Specific equipment, staging needs, accessibility requirements, creative direction, technical constraints..."
                rows={4}
                className="resize-none"
                maxLength={2000}
              />
            </FormControl>
            <FormDescription>
              The more detail you provide, the more accurate your quote will be.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Budget + How Heard side by side */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="budgetRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Approximate Budget</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a budget range" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {BUDGET_RANGES.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="howHeard"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How did you find us?</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {HOW_HEARD_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Preferred Contact Method */}
      <FormField
        control={control}
        name="preferredContact"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Preferred Contact Method{' '}
              <span className="text-destructive" aria-hidden="true">*</span>
            </FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex flex-wrap gap-3 pt-1"
                aria-required="true"
              >
                {PREFERRED_CONTACT_OPTIONS.map(({ value, label }) => {
                  const Icon = contactIcons[value as keyof typeof contactIcons]
                  return (
                    <div key={value} className="flex items-center gap-2">
                      <RadioGroupItem
                        value={value}
                        id={`contact-${value}`}
                        className="text-amber-500 border-border focus-visible:ring-amber-500"
                      />
                      <Label
                        htmlFor={`contact-${value}`}
                        className="flex cursor-pointer items-center gap-1.5 font-normal text-foreground"
                      >
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                        {label}
                      </Label>
                    </div>
                  )
                })}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </fieldset>
  )
}