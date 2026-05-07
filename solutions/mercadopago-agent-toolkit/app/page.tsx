"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";

export default function Home() {
  const [transport] = useState(
    () => new DefaultChatTransport({ api: "/api/agent" }),
  );
  const { messages, sendMessage, status } = useChat({ transport });
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim() || status === "submitted" || status === "streaming") return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "32px 20px 120px",
        minHeight: "100vh",
      }}
    >
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, margin: 0, letterSpacing: "-0.02em" }}>
          Mercado Pago Agent Toolkit
        </h1>
        <p style={{ color: "#888", marginTop: 8 }}>
          Agent that drives Mercado Pago billing flows via{" "}
          <a
            href="https://www.npmjs.com/package/@ar-agents/mercadopago"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#00bcff" }}
          >
            @ar-agents/mercadopago
          </a>{" "}
          tools, Vercel AI SDK 6, and AI Gateway.
        </p>
      </header>

      <section style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[
          "Cobrale $25.000 mensual a juan@example.com con razón Plan Pro.",
          "Buscá pagos de los últimos 30 días por más de $5.000.",
          "Reembolsame el último pago de juan@example.com.",
        ].map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            disabled={status === "submitted" || status === "streaming"}
            style={{
              fontSize: 13,
              padding: "6px 12px",
              borderRadius: 999,
              border: "1px solid #333",
              background: "#171717",
              color: "#ddd",
              cursor: "pointer",
            }}
          >
            {s}
          </button>
        ))}
      </section>

      <div
        style={{
          border: "1px solid #222",
          borderRadius: 12,
          background: "#0f0f0f",
          padding: 20,
          minHeight: 360,
        }}
      >
        {messages.length === 0 ? (
          <p style={{ color: "#666", margin: 0 }}>
            Pick a prompt above or write your own.
          </p>
        ) : (
          messages.map((m) => (
            <div key={m.id} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
                {m.role === "user" ? "You" : "Agent"}
              </div>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                {m.parts
                  .filter((p) => p.type === "text")
                  .map((p, i) => (
                    <span key={i}>{p.text}</span>
                  ))}
              </div>
              {m.parts
                .filter((p) => p.type.startsWith("tool-"))
                .map((p, i) => (
                  <div
                    key={`t-${i}`}
                    style={{
                      marginTop: 8,
                      padding: "8px 12px",
                      borderRadius: 8,
                      background: "#171717",
                      fontSize: 12,
                      color: "#aaa",
                      fontFamily: "ui-monospace, SFMono-Regular, monospace",
                    }}
                  >
                    {p.type.replace(/^tool-/, "")}
                  </div>
                ))}
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        style={{ marginTop: 16, display: "flex", gap: 8 }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Cobrale $X a Y@example.com..."
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #333",
            background: "#0f0f0f",
            color: "#ededed",
            fontSize: 14,
          }}
        />
        <button
          type="submit"
          disabled={
            !input.trim() || status === "submitted" || status === "streaming"
          }
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            border: "1px solid #00bcff",
            background: "#00bcff",
            color: "#000",
            fontSize: 14,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Send
        </button>
      </form>
    </main>
  );
}
