'use client'

import { useRef, useState } from 'react'
import { DiceIcon, VercelLogo } from '@/components/icons'
import { MAX_USERNAME_LENGTH } from '@/lib/protocol'

const ADJ = [
  'swift',
  'cosmic',
  'lucky',
  'silent',
  'brave',
  'fuzzy',
  'neon',
  'turbo',
  'mellow',
  'witty',
]
const NOUN = [
  'otter',
  'falcon',
  'pixel',
  'comet',
  'maple',
  'tiger',
  'raven',
  'panda',
  'cyclone',
  'cactus',
]

function randomNick() {
  const a = ADJ[Math.floor(Math.random() * ADJ.length)]
  const n = NOUN[Math.floor(Math.random() * NOUN.length)]
  return `${a}-${n}-${Math.floor(Math.random() * 90 + 10)}`
}

export function Login({ onJoin }: { onJoin: (name: string) => void }) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const name = value.trim()
    if (!name) {
      inputRef.current?.focus()
      return
    }
    onJoin(name)
  }

  return (
    <section className="relative grid h-full w-full place-items-center overflow-hidden p-6">
      {/* Soft accent glow behind the card — bespoke gradient, kept in CSS. */}
      <div className="login-glow" aria-hidden="true" />
      <div className="relative w-full max-w-[400px] animate-[rise_0.5s_cubic-bezier(0.16,1,0.3,1)_both] text-center">
        <span className="logo logo-lg" aria-hidden="true">
          <VercelLogo />
        </span>
        <h1 className="m-0 mb-[0.4rem] text-[2rem] font-semibold tracking-[-0.03em]">
          WebSocket&nbsp;Chat
        </h1>
        <p className="mt-0 mb-7 text-[0.95rem] text-muted">
          Real-time messaging over native WebSockets.
        </p>

        <form
          className="flex flex-col gap-[0.7rem]"
          autoComplete="off"
          onSubmit={submit}
        >
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              maxLength={MAX_USERNAME_LENGTH}
              placeholder="Pick a nickname…"
              aria-label="Nickname"
              spellCheck={false}
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 rounded-xl border border-border-strong bg-background py-[0.85rem] pr-12 pl-4 text-base text-foreground outline-none transition-[border-color,box-shadow] duration-150 focus:border-accent focus:ring-4 focus:ring-accent-glow"
            />
            <button
              type="button"
              title="Surprise me"
              aria-label="Random nickname"
              onClick={() => {
                setValue(randomNick())
                inputRef.current?.focus()
              }}
              className="absolute right-[0.4rem] grid size-[2.1rem] place-items-center rounded-lg border-0 bg-transparent text-subtle transition-[color,background-color,transform] duration-150 hover:bg-bubble hover:text-foreground active:rotate-90 [&_svg]:size-5"
            >
              <DiceIcon />
            </button>
          </div>
          <button
            type="submit"
            className="rounded-xl border-0 bg-foreground px-4 py-[0.85rem] text-base font-medium text-background transition-[opacity,transform] duration-150 hover:opacity-[0.88] active:scale-[0.99]"
          >
            Join the chat
          </button>
        </form>
      </div>
    </section>
  )
}
