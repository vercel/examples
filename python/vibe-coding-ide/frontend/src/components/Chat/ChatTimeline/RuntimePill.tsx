import React from 'react'
import { Box } from 'lucide-react'
import { SiPython, SiNodedotjs, SiGo, SiRuby } from 'react-icons/si'

const getRuntimeIcon = (runtime: string) => {
  const lower = (runtime || '').toLowerCase()
  if (lower.startsWith('node')) return SiNodedotjs
  if (lower.startsWith('python')) return SiPython
  if (lower.startsWith('go')) return SiGo
  if (lower.startsWith('ruby')) return SiRuby
  return Box
}

export const RuntimePill: React.FC<{ runtime: string }> = ({ runtime }) => {
  const lower = (runtime || '').toLowerCase()
  const Icon = getRuntimeIcon(runtime)
  const label = lower || 'auto'
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm"
      style={{
        background: 'var(--vscode-surface)',
        color: 'var(--vscode-text)',
        border: '1px solid var(--vscode-panel-border)',
      }}
    >
      <Icon className="w-3 h-3" />
      <span>{label}</span>
    </span>
  )
}
