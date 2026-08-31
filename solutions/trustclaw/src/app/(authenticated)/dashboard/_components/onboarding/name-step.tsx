'use client'

import { motion } from 'framer-motion'
import { Input } from '~/components/ui/input'
import { StepLayout, itemVariants } from './step-layout'

interface NameStepProps {
  value: string
  onChange: (name: string) => void
  onNext: () => void
}

export function NameStep({ value, onChange, onNext }: NameStepProps) {
  const canContinue = value.trim().length > 0

  return (
    <StepLayout
      title="Hey! Just spawned in. What's my name?"
      onNext={onNext}
      nextDisabled={!canContinue}
    >
      <motion.div variants={itemVariants}>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Luna, Jarvis, Buddy..."
          maxLength={30}
          className="min-h-[44px]"
          autoFocus
        />
      </motion.div>
    </StepLayout>
  )
}
