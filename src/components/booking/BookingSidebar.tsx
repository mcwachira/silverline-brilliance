import { Phone, Mail, MessageCircle, CheckCircle, Clock, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'

const TRUST_ITEMS = [
  'Free initial consultation included',
  'Professional broadcast-grade equipment',
  'Experienced team of certified technicians',
  'Flexible payment terms available',
  'Full liability insurance coverage',
] as const

const CONTACT_LINKS = [
  {
    href: 'tel:+254712345678',
    icon: Phone,
    label: 'Call Us',
    value: '+254 712 345 678',
    ariaLabel: 'Call us at +254 712 345 678',
  },
  {
    href: 'mailto:bookings@silverlinebrilliance.com',
    icon: Mail,
    label: 'Email Us',
    value: 'bookings@silverlinebrilliance.com',
    ariaLabel: 'Email us at bookings@silverlinebrilliance.com',
  },
  {
    href: 'https://wa.me/254712345678',
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Chat with us',
    ariaLabel: 'Chat with us on WhatsApp',
  },
] as const

export function BookingSidebar() {
  return (
    <div className="space-y-5">

      {/* Response time card */}
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="flex items-start gap-3 p-4">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-foreground">We respond within 24 hours</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Our team reviews every request personally. You'll receive a detailed, itemised quote — not a template.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Need help? Reach us directly</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 pb-4">
          {CONTACT_LINKS.map(({ href, icon: Icon, label, value, ariaLabel }) => (
            <a
              key={href}
              href={href}
              aria-label={ariaLabel}
              className="flex items-center gap-3 rounded-lg p-2.5 text-sm transition-colors hover:bg-muted"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="font-medium text-foreground">{label}</p>
                <p className="truncate text-xs text-muted-foreground">{value}</p>
              </div>
            </a>
          ))}
        </CardContent>
      </Card>

      {/* Trust signals */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
            Why choose us
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <ul className="space-y-2" aria-label="Our guarantees and features">
            {TRUST_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle
                  className="mt-0.5 h-4 w-4 shrink-0 text-green-500"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

    </div>
  )
}