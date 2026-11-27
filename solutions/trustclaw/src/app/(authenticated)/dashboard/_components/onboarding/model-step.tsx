'use client'

import { motion } from 'framer-motion'
import { cn } from '~/lib/utils'
import type { z } from 'zod'
import { allowedAnthropicModelSchema } from '~/server/api/routers/trustclaw/createInstance.schema'
import { MODELS } from './onboarding.consts'
import { StepLayout, itemVariants } from './step-layout'

interface ModelStepProps {
  value: z.infer<typeof allowedAnthropicModelSchema>
  onChange: (model: z.infer<typeof allowedAnthropicModelSchema>) => void
  onNext: () => void
  onBack: () => void
}

export function ModelStep({ value, onChange, onNext, onBack }: ModelStepProps) {
  const handleModelChange = (val: string) => {
    const model = allowedAnthropicModelSchema.safeParse(val)
    if (!model.success) return
    onChange(model.data)
  }

  return (
    <StepLayout
      title="Choose my brain!"
      subtitle="Which Claude model should power me?"
      onNext={onNext}
      onBack={onBack}
    >
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 gap-3">
          {MODELS.map((model) => (
            <button
              key={model.value}
              onClick={() => handleModelChange(model.value)}
              className={cn(
                'flex min-h-[44px] items-center justify-between rounded-lg border p-4 text-left transition-all',
                value === model.value
                  ? 'border-primary ring-primary ring-2'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div>
                <p className="text-sm font-medium">{model.label}</p>
                <p className="text-muted-foreground text-xs">
                  {model.description}
                </p>
              </div>
              <span className="text-muted-foreground text-sm font-medium">
                {model.cost}
              </span>
            </button>
          ))}
        </div>
        <p className="text-muted-foreground mt-2 text-center text-xs">
          You can change this later in settings.
        </p>
      </motion.div>
    </StepLayout>
  )
}
