"use client";

import { useState, useEffect, useRef } from "react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "/svc/api";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState("disconnected");
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);
  const reconnectAttemptRef = useRef(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let cancelled = false;
    let reconnectTimer;

    function connect() {
      if (cancelled) return;

      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}${BACKEND}/ws`;

      setStatus("connecting");
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus("connected");
        reconnectAttemptRef.current = 0;
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "text_delta") {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === "assistant") {
              updated[updated.length - 1] = {
                ...last,
                content: last.content + data.content,
              };
            }
            return updated;
          });
        } else if (data.type === "text_done") {
          setIsStreaming(false);
        } else if (data.type === "error") {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === "assistant") {
              updated[updated.length - 1] = {
                ...last,
                content: data.content,
                isError: true,
              };
            }
            return updated;
          });
          setIsStreaming(false);
        }
      };

      ws.onclose = () => {
        setStatus("disconnected");
        wsRef.current = null;
        if (cancelled) return;
        const attempt = reconnectAttemptRef.current;
        const delay =
          Math.min(1000 * 2 ** attempt, 5000) + Math.random() * 1000;
        reconnectAttemptRef.current = attempt + 1;
        reconnectTimer = setTimeout(connect, delay);
      };

      ws.onerror = () => ws.close();
    }

    connect();

    return () => {
      cancelled = true;
      clearTimeout(reconnectTimer);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    const content = input.trim();
    if (
      !content ||
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN ||
      isStreaming
    ) {
      return;
    }

    const allMessages = [
      ...messages.filter((m) => !m.isError),
      { role: "user", content },
    ];

    setMessages([...allMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    wsRef.current.send(
      JSON.stringify({
        type: "message",
        messages: allMessages.map(({ role, content }) => ({ role, content })),
      }),
    );
  };

  return (
    <div className="container">
      <header>
        <h1>AI Chat</h1>
        <span className={`status ${status}`}>
          <span className="dot" />
          {status}
        </span>
      </header>

      <main>
        {messages.length === 0 && (
          <div className="empty">Send a message to start chatting</div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.role} ${msg.isError ? "error" : ""}`}
          >
            <div className="bubble">
              {msg.content}
              {msg.role === "assistant" &&
                isStreaming &&
                i === messages.length - 1 && <span className="cursor" />}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={status !== "connected" || isStreaming}
        />
        <button
          type="submit"
          disabled={!input.trim() || status !== "connected" || isStreaming}
        >
          Send
        </button>
      </form>
    </div>
  );
}
