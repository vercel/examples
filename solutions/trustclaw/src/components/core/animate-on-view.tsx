'use client'

import { useRef, useEffect, useState, type ReactNode } from 'react'

interface AnimateOnViewProps {
  children: ReactNode
  className?: string
  animation?: string
  delay?: number
  duration?: number
  once?: boolean
  margin?: string
  as?: 'div' | 'section' | 'h1' | 'h2' | 'p' | 'span'
}

export function AnimateOnView({
  children,
  className = '',
  animation = 'fade-in-up',
  delay = 0,
  duration = 0.5,
  once = true,
  margin = '-100px',
  as: Tag = 'div',
}: AnimateOnViewProps) {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { rootMargin: margin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once, margin])

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      className={className}
      style={{
        opacity: isVisible ? undefined : 0,
        animation: isVisible
          ? `${animation} ${duration}s ease-out ${delay}s both`
          : 'none',
      }}
    >
      {children}
    </Tag>
  )
}
