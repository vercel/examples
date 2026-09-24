'use client'

import { motion } from 'framer-motion'
import { cn } from '~/lib/utils'
import { WRITING_STYLES, type WritingStyleKey } from './onboarding.consts'
import { StepLayout, itemVariants } from './step-layout'

interface WritingStyleStepProps {
  value: WritingStyleKey | null
  onChange: (style: WritingStyleKey) => void
  onNext: () => void
  onBack: () => void
}

export function WritingStyleStep({
  value,
  onChange,
  onNext,
  onBack,
}: WritingStyleStepProps) {
  return (
    <StepLayout
      title="How should I write?"
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value}
    >
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {WRITING_STYLES.map((style) => (
            <button
              key={style.key}
              onClick={() => {
                onChange(style.key)
              }}
              className={cn(
                'min-h-[44px] cursor-pointer rounded-lg border p-4 text-left transition-all',
                value === style.key
                  ? 'border-primary ring-primary ring-2'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <p className="text-sm font-medium">{style.label}</p>
            </button>
          ))}
        </div>
      </motion.div>
    </StepLayout>
  )
}
