'use client'

import { AnimatePresence, motion } from 'framer-motion'

type AnimationState =
  | 'idle'
  | 'happy'
  | 'thinking'
  | 'celebrating'
  | 'listening'

interface OnboardingClawLogoProps {
  name: string | null
  writingStyleItem: string | null
  personalityOutfit: string | null
  emoji: string | null
  animationState: AnimationState
}

function getAnimationClass(state: AnimationState): string {
  switch (state) {
    case 'happy':
      return 'animate-[float-happy_2s_ease-in-out_infinite]'
    case 'thinking':
      return 'animate-[float-thinking_6s_ease-in-out_infinite]'
    case 'celebrating':
      return 'animate-[celebrate_1s_ease-in-out]'
    case 'listening':
      return 'animate-[listening_3s_ease-in-out_infinite]'
    case 'idle':
    default:
      return 'animate-[float_4s_ease-in-out_infinite]'
  }
}

function getPupilRadius(state: AnimationState): number {
  return state === 'happy' ? 3 : 2
}

const accessoryTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 20,
}
const accessoryExit = { scale: 0, opacity: 0, transition: { duration: 0.2 } }

function WritingStyleAccessory({ item }: { item: string }) {
  switch (item) {
    case 'phone':
      return (
        <motion.g
          key="phone"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={accessoryExit}
          transition={accessoryTransition}
        >
          <image
            href="/images/clawd_clothing/iphone.svg"
            x="78"
            y="40"
            width="35"
            height="35"
          />
        </motion.g>
      )
    case 'briefcase':
      return (
        <motion.g
          key="briefcase"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={accessoryExit}
          transition={accessoryTransition}
        >
          <image
            href="/images/clawd_clothing/briefcase.svg"
            x="72"
            y="35"
            width="45"
            height="45"
          />
        </motion.g>
      )
    case 'heart':
      return (
        <motion.g
          key="heart"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={accessoryExit}
          transition={accessoryTransition}
        >
          <image
            href="/images/clawd_clothing/heart.svg"
            x="75"
            y="35"
            width="40"
            height="40"
          />
        </motion.g>
      )
    case 'partyhat':
      return (
        <motion.g
          key="partyhat"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={accessoryExit}
          transition={accessoryTransition}
        >
          <image
            href="/images/clawd_clothing/hat.svg"
            x="38"
            y="-5"
            width="45"
            height="45"
          />
        </motion.g>
      )
    default:
      return null
  }
}

function PersonalityOutfitAccessory({ outfit }: { outfit: string }) {
  switch (outfit) {
    case 'pompoms':
      return (
        <motion.g
          key="pompoms"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={accessoryExit}
          transition={accessoryTransition}
        >
          <image
            href="/images/clawd_clothing/pom-pom.svg"
            x="-10"
            y="30"
            width="35"
            height="35"
          />
          <image
            href="/images/clawd_clothing/pom-pom.svg"
            x="95"
            y="30"
            width="35"
            height="35"
          />
        </motion.g>
      )
    case 'sunglasses':
      return (
        <motion.g
          key="sunglasses"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={accessoryExit}
          transition={accessoryTransition}
        >
          <image
            href="/images/clawd_clothing/sunglasses.svg"
            x="0"
            y="12"
            width="120"
            height="50"
          />
        </motion.g>
      )
    case 'coffee':
      return (
        <motion.g
          key="coffee"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={accessoryExit}
          transition={accessoryTransition}
        >
          <image
            href="/images/clawd_clothing/coffee.svg"
            x="-3"
            y="35"
            width="40"
            height="40"
          />
        </motion.g>
      )
    case 'nerdglasses':
      return (
        <motion.g
          key="nerdglasses"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={accessoryExit}
          transition={accessoryTransition}
        >
          <image
            href="/images/clawd_clothing/nerd-glasses.svg"
            x="-5"
            y="11"
            width="130"
            height="55"
          />
        </motion.g>
      )
    default:
      return null
  }
}

export function OnboardingClawLogo({
  name,
  writingStyleItem,
  personalityOutfit,
  emoji,
  animationState,
}: OnboardingClawLogoProps) {
  const pupilR = getPupilRadius(animationState)

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="max-w-full truncate text-center text-lg font-semibold md:text-2xl">
        {name ? `${name}${emoji ? ` ${emoji}` : ''}` : '\u00A0'}
      </p>
      <div className="h-20 w-20 md:h-[120px] md:w-[120px]">
        <svg
          viewBox="0 0 120 120"
          overflow="visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`h-full w-full drop-shadow-[0_0_12px_oklch(0.488_0.243_264.376/0.4)] ${getAnimationClass(
            animationState
          )}`}
        >
          <path
            d="M60 10 C30 10 15 35 15 55 C15 75 30 95 45 100 L45 110 L55 110 L55 100 C55 100 60 102 65 100 L65 110 L75 110 L75 100 C90 95 105 75 105 55 C105 35 90 10 60 10Z"
            fill="url(#onboarding-claw-gradient)"
          />
          <path
            d="M20 45 C5 40 0 50 5 60 C10 70 20 65 25 55 C28 48 25 45 20 45Z"
            fill="url(#onboarding-claw-gradient)"
          />
          <path
            d="M100 45 C115 40 120 50 115 60 C110 70 100 65 95 55 C92 48 95 45 100 45Z"
            fill="url(#onboarding-claw-gradient)"
          />
          <path
            d="M45 15 Q35 5 30 8"
            stroke="oklch(0.488 0.243 264.376)"
            strokeWidth="2"
            strokeLinecap="round"
            className="origin-center animate-[wiggle_2s_ease-in-out_infinite]"
          />
          <path
            d="M75 15 Q85 5 90 8"
            stroke="oklch(0.488 0.243 264.376)"
            strokeWidth="2"
            strokeLinecap="round"
            className="origin-center animate-[wiggle_2s_ease-in-out_infinite]"
          />

          <circle cx="45" cy="35" r="6" className="fill-background" />
          <circle cx="75" cy="35" r="6" className="fill-background" />
          <circle
            cx="46"
            cy="34"
            r={pupilR}
            fill="oklch(0.488 0.243 264.376)"
            className="animate-[blink_3s_ease-in-out_infinite]"
          />
          <circle
            cx="76"
            cy="34"
            r={pupilR}
            fill="oklch(0.488 0.243 264.376)"
            className="animate-[blink_3s_ease-in-out_infinite]"
          />

          <AnimatePresence>
            {writingStyleItem && (
              <WritingStyleAccessory item={writingStyleItem} />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {personalityOutfit && (
              <PersonalityOutfitAccessory outfit={personalityOutfit} />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {emoji && (
              <motion.text
                key={emoji}
                x="60"
                y="75"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="18"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
                transition={accessoryTransition}
              >
                {emoji}
              </motion.text>
            )}
          </AnimatePresence>

          <defs>
            <linearGradient
              id="onboarding-claw-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="oklch(0.488 0.243 264.376)" />
              <stop offset="100%" stopColor="oklch(0.388 0.2 264.376)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}
