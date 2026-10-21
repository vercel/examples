'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

const SAMPLE_URL =
  'https://raw.githubusercontent.com/Unstructured-IO/unstructured/main/example-docs/pdf/layout-parser-paper.pdf';

// Keep in sync with the Deploy button in this folder's README.md.
const DEPLOY_URL =
  'https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstarter%2Funstructured-transform-ai-sdk&env=ANTHROPIC_API_KEY,UNSTRUCTURED_API_KEY&envDescription=API%20keys%20for%20Claude%20and%20the%20Unstructured%20Transform%20MCP%20server&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Fblob%2Fmain%2Fstarter%2Funstructured-transform-ai-sdk%2F.env.example&project-name=unstructured-transform-ai-sdk&repository-name=unstructured-transform-ai-sdk';

export default function Chat({ configured }: { configured: boolean }) {
  const { messages, sendMessage, status, error } = useChat();
  const [input, setInput] = useState('');

  const busy = status === 'submitted' || status === 'streaming';
  const disabled = !configured || busy;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!configured) return;
    const text = input.trim();
    if (!text || busy) return;
    sendMessage({ text });
    setInput('');
  }

  return (
    <div className="wrap">
      <div className="header">
        <h1>📄 Unstructured Transform MCP + Vercel AI SDK</h1>
        <p>
          Paste a public document URL and ask a question. The model calls
          Unstructured&apos;s Transform MCP server to parse it into clean,
          structured content.
        </p>
      </div>

      {!configured && (
        <div className="preview" role="note">
          <strong>Preview mode.</strong> This demo isn&apos;t connected to API
          keys, so the chat is disabled. Deploy your own copy — you&apos;ll be
          prompted for your Anthropic and Unstructured keys — to try it live.
          <div className="preview-cta">
            <a href={DEPLOY_URL} target="_blank" rel="noopener noreferrer">
              Deploy to Vercel →
            </a>
          </div>
        </div>
      )}

      {configured && messages.length === 0 && (
        <div className="hint">
          Try:{' '}
          <em>
            &ldquo;Parse this PDF into markdown and summarize the sections:{' '}
            <code>{SAMPLE_URL}</code>&rdquo;
          </em>
        </div>
      )}

      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className={`msg ${message.role}`}>
            <div className="role">{message.role}</div>
            {message.parts.map((part, i) => {
              if (part.type === 'text') {
                return <span key={i}>{part.text}</span>;
              }
              // MCP tools surface as dynamic tool parts — show a lightweight trace.
              if (part.type === 'dynamic-tool') {
                return (
                  <div key={i} className="tool">
                    🔧 calling <strong>{part.toolName}</strong>…
                  </div>
                );
              }
              return null;
            })}
          </div>
        ))}
        {error && (
          <div
            className="msg assistant"
            role="alert"
            style={{ color: '#fca5a5', borderColor: '#7f1d1d' }}
          >
            Something went wrong while processing your request. Please try again.
          </div>
        )}
      </div>

      <div className="composer">
        <form onSubmit={submit}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              configured
                ? 'Paste a document URL and ask a question…'
                : 'Preview mode — deploy your own copy to chat'
            }
            aria-label="Chat prompt — paste a public document URL and ask a question"
            disabled={disabled}
          />
          <button type="submit" disabled={disabled || !input.trim()}>
            {busy ? '…' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
