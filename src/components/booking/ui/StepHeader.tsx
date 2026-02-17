interface StepHeaderProps {
  title: string
  description: string
}

export function StepHeader({ title, description }: StepHeaderProps) {
  return (
    <div className="mb-2">
      <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        {title}
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
