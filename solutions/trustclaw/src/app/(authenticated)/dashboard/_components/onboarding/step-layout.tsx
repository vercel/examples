'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Button } from '~/components/ui/button'
import { containerVariants, itemVariants } from './onboarding.variants'

export { itemVariants } from './onboarding.variants'

interface StepLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
  onNext?: () => void
  onBack?: () => void
  onSkip?: () => void
  nextDisabled?: boolean
  nextLabel?: string
}

export function StepLayout({
  title,
  subtitle,
  children,
  onNext,
  onBack,
  onSkip,
  nextDisabled,
  nextLabel,
}: StepLayoutProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
        )}
      </motion.div>

      {children}

      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-2 sm:flex-row sm:justify-between"
      >
        {onBack && (
          <button
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground min-h-[44px] text-sm underline-offset-4 hover:underline"
          >
            Back
          </button>
        )}
        <div className="flex gap-2">
          {onSkip && (
            <Button
              variant="outline"
              onClick={onSkip}
              className="min-h-[44px] w-full sm:w-auto"
            >
              Skip
            </Button>
          )}
          {onNext && (
            <Button
              onClick={onNext}
              disabled={nextDisabled}
              className="min-h-[44px] w-full sm:w-auto"
            >
              {nextLabel ?? 'Continue'}
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
