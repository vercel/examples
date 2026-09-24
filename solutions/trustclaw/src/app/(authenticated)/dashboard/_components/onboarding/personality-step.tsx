'use client'

import { motion } from 'framer-motion'
import { cn } from '~/lib/utils'
import { PERSONALITIES, type PersonalityKey } from './onboarding.consts'
import { StepLayout, itemVariants } from './step-layout'

interface PersonalityStepProps {
  value: PersonalityKey | null
  onChange: (personality: PersonalityKey) => void
  onNext: () => void
  onBack: () => void
}

export function PersonalityStep({
  value,
  onChange,
  onNext,
  onBack,
}: PersonalityStepProps) {
  return (
    <StepLayout
      title="What's my personality?"
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value}
    >
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PERSONALITIES.map((personality) => (
            <button
              key={personality.key}
              onClick={() => {
                onChange(personality.key)
              }}
              className={cn(
                'min-h-[44px] cursor-pointer rounded-lg border p-4 text-left transition-all',
                value === personality.key
                  ? 'border-primary ring-primary ring-2'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <p className="text-sm font-medium">{personality.label}</p>
            </button>
          ))}
        </div>
      </motion.div>
    </StepLayout>
  )
}
