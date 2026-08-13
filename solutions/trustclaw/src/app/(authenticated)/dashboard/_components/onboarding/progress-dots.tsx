import { cn } from '~/lib/utils'
import { STEP_ORDER } from './onboarding.consts'

export function ProgressDots({ current }: { current: number }) {
  const total = STEP_ORDER.length

  return (
    <div className="flex flex-col items-center gap-1.5 py-2">
      <p className="text-muted-foreground text-xs">
        Step {Math.min(current, total)} of {total}
      </p>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300 md:h-2',
              i < current
                ? 'bg-primary w-3 md:w-4'
                : 'bg-muted-foreground/25 w-1.5 md:w-2'
            )}
          />
        ))}
      </div>
    </div>
  )
}
