'use client'

import { motion } from 'framer-motion'
import { Textarea } from '~/components/ui/textarea'
import { StepLayout, itemVariants } from './step-layout'

interface LoreStepProps {
  value: string
  onChange: (lore: string) => void
  onNext: () => void
  onBack: () => void
  onSkip: () => void
}

export function LoreStep({
  value,
  onChange,
  onNext,
  onBack,
  onSkip,
}: LoreStepProps) {
  return (
    <StepLayout
      title="Any more lore for me?"
      subtitle="Optional - give me some backstory or special instructions"
      onNext={onNext}
      onBack={onBack}
      onSkip={onSkip}
      nextDisabled={!value.trim()}
    >
      <motion.div variants={itemVariants} className="space-y-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g., You're a time-traveling librarian who speaks in metaphors..."
          maxLength={500}
          className="min-h-[120px]"
        />
        <p className="text-muted-foreground text-right text-xs">
          {value.length}/500
        </p>
      </motion.div>
    </StepLayout>
  )
}
