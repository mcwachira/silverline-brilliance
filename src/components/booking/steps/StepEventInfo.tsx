
'use client'
import { useFormContext, useWatch } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
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
import { Slider } from '@/src/components/ui/slider'
import type { BookingFormValues } from '@/src/lib/booking/schema'
import { EVENT_TYPES } from '@/src/lib/booking/constants'
import { StepHeader } from '../ui/StepHeader'

// Minimum date is today (client-rendered, so Date.now() is fine here)
function getMinDate(): string {
  return new Date().toISOString().split('T')[0]
}

export function StepEventInfo() {
  const { control, setValue } = useFormContext<BookingFormValues>()
  // Watch eventType to conditionally show "Other" input
  const eventType = useWatch({ control, name: 'eventType' })
  const attendees = useWatch({ control, name: 'expectedAttendees' })

  return (
    <fieldset className="space-y-6 border-0 p-0">
      <legend className="sr-only">Event details</legend>

      <StepHeader
        title="Event Details"
        description="Tell us about your event so we can prepare the right team and equipment."
      />

      {/* Event Type + conditional "Other" */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="eventType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Event Type <span className="text-destructive" aria-hidden="true">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger aria-required="true">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EVENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditionally shown — only when 'Other' is selected */}
        {eventType === 'Other' && (
          <FormField
            control={control}
            name="eventTypeOther"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Describe Event Type <span className="text-destructive" aria-hidden="true">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="eventTypeOther"
                    type="text"
                    placeholder="e.g. Film screening, gala dinner"
                    aria-required="true"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* Event Name */}
      <FormField
        control={control}
        name="eventName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Event Name <span className="text-destructive" aria-hidden="true">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                id="eventName"
                type="text"
                placeholder="e.g. Annual Corporate Gala 2026"
                aria-required="true"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Date / Start Time / End Time */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField
          control={control}
          name="eventDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Event Date <span className="text-destructive" aria-hidden="true">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="eventDate"
                  type="date"
                  min={getMinDate()}
                  aria-required="true"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="eventStartTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Start Time <span className="text-destructive" aria-hidden="true">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="eventStartTime"
                  type="time"
                  aria-required="true"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="eventEndTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="eventEndTime"
                  type="time"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Expected Attendees — Slider */}
      <FormField
        control={control}
        name="expectedAttendees"
        render={() => (
          <FormItem>
            <FormLabel>
              Expected Attendees:{' '}
              <span className="font-bold text-foreground">
                {attendees?.toLocaleString() ?? 50}
              </span>
            </FormLabel>
            <FormControl>
              <div className="px-1">
                <Slider
                  min={10}
                  max={5000}
                  step={10}
                  value={[attendees ?? 50]}
                  onValueChange={(val) =>
                    setValue('expectedAttendees', val[0], { shouldValidate: true })
                  }
                  aria-label="Expected number of attendees"
                  aria-valuemin={10}
                  aria-valuemax={5000}
                  aria-valuenow={attendees ?? 50}
                  className="py-3"
                />
                <div
                  className="flex justify-between text-xs text-muted-foreground"
                  aria-hidden="true"
                >
                  <span>10</span>
                  <span>5,000+</span>
                </div>
              </div>
            </FormControl>
            <FormDescription>
              For events with more than 5,000 attendees, contact us directly.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Venue Name */}
      <FormField
        control={control}
        name="venueName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Venue / Location <span className="text-destructive" aria-hidden="true">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                id="venueName"
                type="text"
                placeholder="e.g. Nairobi Serena Hotel"
                aria-required="true"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Venue Address — optional */}
      <FormField
        control={control}
        name="venueAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Venue Address</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                id="venueAddress"
                placeholder="Full venue address (optional)"
                rows={2}
                className="resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </fieldset>
  )
}