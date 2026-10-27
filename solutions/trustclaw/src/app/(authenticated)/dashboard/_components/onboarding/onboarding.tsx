'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import type { z } from 'zod'
import { trpc } from '~/clients/trpc'
import { showTrpcErrorToast } from '~/components/core/toast-notifications'
import { ErrorBoundary } from '~/components/core/error-boundary'
import { Button } from '~/components/ui/button'
import { allowedAnthropicModelSchema } from '~/server/api/routers/trustclaw/createInstance.schema'
import {
  STEP_ORDER,
  WRITING_STYLES,
  PERSONALITIES,
  WRITING_STYLE_ITEM_MAP,
  PERSONALITY_OUTFIT_MAP,
  type Step,
  type WritingStyleKey,
  type PersonalityKey,
} from './onboarding.consts'
import { OnboardingClawLogo } from './onboarding-claw-logo'
import { NameStep } from './name-step'
import { WritingStyleStep } from './writing-style-step'
import { PersonalityStep } from './personality-step'
import { EmojiStep } from './emoji-step'
import { LoreStep } from './lore-step'
import { ModelStep } from './model-step'
import { IntegrationsStep } from './integrations-step'
import { TelegramStep } from './telegram-step'
import { ProgressDots } from './progress-dots'
import { containerVariants, itemVariants } from './onboarding.variants'

type AnimationState =
  | 'idle'
  | 'happy'
  | 'thinking'
  | 'celebrating'
  | 'listening'

interface OnboardingWizardState {
  name: string
  writingStyle: WritingStyleKey | null
  personality: PersonalityKey | null
  emoji: string | null
  lore: string
  anthropicModel: z.infer<typeof allowedAnthropicModelSchema>
}

function getAnimationState(step: Step): AnimationState {
  switch (step) {
    case 'name':
      return 'happy'
    case 'writing-style':
      return 'idle'
    case 'personality':
      return 'idle'
    case 'emoji':
      return 'celebrating'
    case 'lore':
      return 'listening'
    case 'model':
      return 'thinking'
    case 'integrations':
      return 'celebrating'
    case 'telegram':
      return 'idle'
  }
}

interface SavedOnboardingState {
  currentStep: string
  name: string
  writingStyle: string | null
  personality: string | null
  emoji: string | null
  lore: string
  anthropicModel: string
}

interface OnboardingProps {
  onComplete: () => void
  hasExistingInstance?: boolean
  savedState?: SavedOnboardingState | null
}

function isValidStep(s: string): s is Step {
  return (STEP_ORDER satisfies readonly Step[]).some((step) => step === s)
}

export function Onboarding({
  onComplete,
  hasExistingInstance = false,
  savedState,
}: OnboardingProps) {
  const initialStep: Step =
    savedState?.currentStep && isValidStep(savedState.currentStep)
      ? savedState.currentStep
      : 'name'

  const [step, setStep] = useState<Step>(initialStep)
  const [wizardState, setWizardState] = useState<OnboardingWizardState>(() => {
    const parsedModel = allowedAnthropicModelSchema.safeParse(
      savedState?.anthropicModel
    )
    return {
      name: savedState?.name ?? '',
      writingStyle:
        WRITING_STYLES.find((s) => s.key === savedState?.writingStyle)?.key ??
        null,
      personality:
        PERSONALITIES.find((p) => p.key === savedState?.personality)?.key ??
        null,
      emoji: savedState?.emoji ?? null,
      lore: savedState?.lore ?? '',
      anthropicModel: parsedModel.success
        ? parsedModel.data
        : 'claude-sonnet-4-5-20250929',
    }
  })

  const savedStepIndex =
    savedState?.currentStep && isValidStep(savedState.currentStep)
      ? STEP_ORDER.indexOf(savedState.currentStep)
      : -1
  const [instanceCreated, setInstanceCreated] = useState(
    hasExistingInstance || savedStepIndex > STEP_ORDER.indexOf('model')
  )

  const utils = trpc.useUtils()

  const { data: statusData } = trpc.trustclaw.getStatus.useQuery()
  const telegramConfigured = statusData?.telegramConfigured ?? true

  const createInstance = trpc.trustclaw.createInstance.useMutation({
    onSuccess: () => {
      void utils.trustclaw.getInstance.invalidate()
    },
  })

  const saveState = trpc.trustclaw.saveOnboardingState.useMutation()

  const persistState = async (
    nextStep: Step,
    currentWizardState: OnboardingWizardState
  ) => {
    await saveState.mutateAsync({
      currentStep: nextStep,
      name: currentWizardState.name,
      writingStyle: currentWizardState.writingStyle,
      personality: currentWizardState.personality,
      emoji: currentWizardState.emoji,
      lore: currentWizardState.lore,
      anthropicModel: currentWizardState.anthropicModel,
    })
  }

  const goToStep = (nextStep: Step) => {
    setStep(nextStep)
    void persistState(nextStep, wizardState)
  }

  const goBack = () => {
    const currentIndex = STEP_ORDER.indexOf(step)
    if (currentIndex > 0) {
      const prevStep = STEP_ORDER[currentIndex - 1]!
      setStep(prevStep)
      void persistState(prevStep, wizardState)
    }
  }

  const handleModelNext = async () => {
    if (instanceCreated) {
      goToStep('integrations')
      return
    }
    try {
      await createInstance.mutateAsync({
        anthropicModel: wizardState.anthropicModel,
      })
      setInstanceCreated(true)
      goToStep('integrations')
    } catch (error) {
      showTrpcErrorToast(error)
    }
  }

  const handleComplete = () => {
    onComplete()
  }

  const writingStyleItem = wizardState.writingStyle
    ? WRITING_STYLE_ITEM_MAP[wizardState.writingStyle] ?? null
    : null

  const personalityOutfit = wizardState.personality
    ? PERSONALITY_OUTFIT_MAP[wizardState.personality] ?? null
    : null

  if (createInstance.isPending) {
    return (
      <div className="flex h-full items-start justify-center p-4 pt-12 md:pt-20">
        <div className="w-full max-w-lg">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-6 text-center"
          >
            <motion.div variants={itemVariants}>
              <Loader2 className="text-primary mx-auto h-10 w-10 animate-spin" />
              <h2 className="mt-4 text-xl font-semibold tracking-tight">
                Setting things up...
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Creating your TrustClaw instance and connecting tools
              </p>
            </motion.div>
            {createInstance.isError && (
              <motion.div variants={itemVariants}>
                <Button
                  variant="outline"
                  className="min-h-[44px]"
                  onClick={() => void handleModelNext()}
                >
                  Retry
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full items-start justify-center p-4 pt-12 md:pt-20">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex flex-col items-center">
          <OnboardingClawLogo
            name={wizardState.name || null}
            writingStyleItem={writingStyleItem}
            personalityOutfit={personalityOutfit}
            emoji={wizardState.emoji}
            animationState={getAnimationState(step)}
          />
        </div>

        <ProgressDots current={STEP_ORDER.indexOf(step) + 1} />

        <AnimatePresence mode="wait">
          {step === 'name' && (
            <NameStep
              key="name"
              value={wizardState.name}
              onChange={(name) => setWizardState((prev) => ({ ...prev, name }))}
              onNext={() => goToStep('writing-style')}
            />
          )}

          {step === 'writing-style' && (
            <WritingStyleStep
              key="writing-style"
              value={wizardState.writingStyle}
              onChange={(writingStyle) =>
                setWizardState((prev) => ({ ...prev, writingStyle }))
              }
              onNext={() => goToStep('personality')}
              onBack={goBack}
            />
          )}

          {step === 'personality' && (
            <PersonalityStep
              key="personality"
              value={wizardState.personality}
              onChange={(personality) =>
                setWizardState((prev) => ({ ...prev, personality }))
              }
              onNext={() => goToStep('emoji')}
              onBack={goBack}
            />
          )}

          {step === 'emoji' && (
            <EmojiStep
              key="emoji"
              value={wizardState.emoji}
              onChange={(emoji) =>
                setWizardState((prev) => ({ ...prev, emoji }))
              }
              onNext={() => goToStep('lore')}
              onBack={goBack}
            />
          )}

          {step === 'lore' && (
            <LoreStep
              key="lore"
              value={wizardState.lore}
              onChange={(lore) => setWizardState((prev) => ({ ...prev, lore }))}
              onNext={() => goToStep('model')}
              onBack={goBack}
              onSkip={() => goToStep('model')}
            />
          )}

          {step === 'model' && (
            <ModelStep
              key="model"
              value={wizardState.anthropicModel}
              onChange={(anthropicModel) =>
                setWizardState((prev) => ({ ...prev, anthropicModel }))
              }
              onNext={() => void handleModelNext()}
              onBack={goBack}
            />
          )}

          {step === 'integrations' && instanceCreated && (
            <ErrorBoundary>
              <IntegrationsStep
                key="integrations"
                onNext={() =>
                  telegramConfigured ? goToStep('telegram') : handleComplete()
                }
                onBack={goBack}
                onSkip={() =>
                  telegramConfigured ? goToStep('telegram') : handleComplete()
                }
              />
            </ErrorBoundary>
          )}

          {step === 'telegram' && telegramConfigured && (
            <TelegramStep
              key="telegram"
              onBack={goBack}
              onSkip={() => {
                void handleComplete()
              }}
              onComplete={() => void handleComplete()}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
