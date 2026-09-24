'use client'

interface OpenClawLogoProps {
  size?: number
  className?: string
}

export function OpenClawLogo({ size = 40, className }: OpenClawLogoProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full drop-shadow-[0_0_12px_oklch(0.488_0.243_264.376/0.4)]"
      >
        <path
          d="M60 10 C30 10 15 35 15 55 C15 75 30 95 45 100 L45 110 L55 110 L55 100 C55 100 60 102 65 100 L65 110 L75 110 L75 100 C90 95 105 75 105 55 C105 35 90 10 60 10Z"
          fill="url(#claw-gradient)"
          className="animate-[float_4s_ease-in-out_infinite]"
        />
        <path
          d="M20 45 C5 40 0 50 5 60 C10 70 20 65 25 55 C28 48 25 45 20 45Z"
          fill="url(#claw-gradient)"
          className="animate-[float_4s_ease-in-out_infinite]"
        />
        <path
          d="M100 45 C115 40 120 50 115 60 C110 70 100 65 95 55 C92 48 95 45 100 45Z"
          fill="url(#claw-gradient)"
          className="animate-[float_4s_ease-in-out_infinite]"
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
          r="2"
          fill="oklch(0.488 0.243 264.376)"
          className="animate-[blink_3s_ease-in-out_infinite]"
        />
        <circle
          cx="76"
          cy="34"
          r="2"
          fill="oklch(0.488 0.243 264.376)"
          className="animate-[blink_3s_ease-in-out_infinite]"
        />
        <defs>
          <linearGradient
            id="claw-gradient"
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
  )
}
