'use client'

import { useState } from 'react'
import { Composer } from '@/components/Composer'
import { Header } from '@/components/Header'
import { Login } from '@/components/Login'
import { MessageList } from '@/components/MessageList'
import { TypingRow } from '@/components/TypingRow'
import { useChatSocket } from '@/lib/useChatSocket'

export function Chat() {
  const chat = useChatSocket()
  const [draft, setDraft] = useState('')

  // Login view until a nickname is chosen (or a saved one is restored). The
  // socket lives in useChatSocket and persists across this switch.
  if (!chat.username) {
    return <Login onJoin={chat.join} />
  }

  return (
    <section className="flex h-full w-full max-w-[780px] flex-col overflow-hidden bg-background min-[800px]:max-h-[1200px] min-[800px]:rounded-[18px] min-[800px]:border min-[800px]:border-border min-[800px]:shadow-[var(--shadow-lift)]">
      <Header connectionState={chat.connectionState} presence={chat.presence} />
      <MessageList items={chat.items} clientId={chat.clientId} />
      <TypingRow draftLength={draft.length} typingUsers={chat.typingUsers} />
      <Composer
        draft={draft}
        onDraftChange={setDraft}
        onSend={chat.sendMessage}
        onTyping={chat.notifyTyping}
      />
    </section>
  )
}
