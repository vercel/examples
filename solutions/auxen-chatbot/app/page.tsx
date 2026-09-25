"use client";

import { useState, type FormEvent } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) {
        const err = await res.text();
        setMessages([
          ...next,
          { role: "assistant", content: `Error: ${err.slice(0, 300)}` },
        ]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const data = trimmed.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const chunk = JSON.parse(data);
            const delta = chunk.choices?.[0]?.delta?.content;
            if (typeof delta === "string") {
              assistantText += delta;
              setMessages((prev) => {
                const copy = prev.slice();
                copy[copy.length - 1] = {
                  role: "assistant",
                  content: assistantText,
                };
                return copy;
              });
            }
          } catch {
            // ignore parse errors on partial chunks
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 max-w-2xl mx-auto">
      <div className="w-full">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold">Auxen Chat</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Next.js + your own dedicated LLM endpoint on Auxen
          </p>
        </header>

        <div className="flex flex-col gap-4 mb-6">
          {messages.length === 0 ? (
            <p className="text-neutral-500 text-sm">
              Set <code className="text-neutral-300">AUXEN_API_BASE</code> and{" "}
              <code className="text-neutral-300">AUXEN_API_KEY</code> in your
              environment, then say hi.
            </p>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className="flex flex-col gap-1 rounded-lg border border-neutral-800 p-3 bg-neutral-900"
              >
                <span className="text-[11px] uppercase tracking-wide text-neutral-500">
                  {m.role}
                </span>
                <span className="whitespace-pre-wrap text-sm text-neutral-100">
                  {m.content || (m.role === "assistant" && isLoading ? "…" : "")}
                </span>
              </div>
            ))
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex gap-2 sticky bottom-0 bg-[#0a0a0a] py-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message…"
            className="flex-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:border-neutral-600"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-lg bg-white text-black px-4 py-2 text-sm font-medium disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
