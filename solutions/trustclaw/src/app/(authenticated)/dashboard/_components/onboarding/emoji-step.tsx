'use client'

import { motion } from 'framer-motion'
import { cn } from '~/lib/utils'
import { CURATED_EMOJIS } from './onboarding.consts'
import { StepLayout, itemVariants } from './step-layout'

interface EmojiStepProps {
  value: string | null
  onChange: (emoji: string) => void
  onNext: () => void
  onBack: () => void
}

export function EmojiStep({ value, onChange, onNext, onBack }: EmojiStepProps) {
  return (
    <StepLayout
      title="Pick my emoji!"
      subtitle="This'll be my signature look"
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value}
    >
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-7 md:grid-cols-8">
          {CURATED_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onChange(emoji)
              }}
              className={cn(
                'flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border text-xl transition-all',
                value === emoji
                  ? 'border-primary ring-primary ring-2'
                  : 'border-border hover:border-primary/50'
              )}
            >
              {emoji}
            </button>
          ))}
        </div>
      </motion.div>
    </StepLayout>
  )
}
