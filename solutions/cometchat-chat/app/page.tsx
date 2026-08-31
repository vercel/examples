export default function Home() {
  return (
    <main
      style={{
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        maxWidth: 720,
        margin: "0 auto",
        padding: "48px 24px",
        lineHeight: 1.6,
        color: "#111",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>CometChat × Vercel</h1>
      <p style={{ fontSize: 18, color: "#444", marginTop: 0 }}>
        This is a blank Next.js (App Router) app with CometChat skills
        pre-installed. Ask your AI coding agent to add chat — it already knows
        how.
      </p>

      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 20 }}>Try this</h2>
        <p>
          Open this project in Claude Code, Cursor, Copilot, or any
          Agent-Skills-compatible IDE, then ask:
        </p>
        <pre
          style={{
            background: "#f4f4f5",
            padding: 16,
            borderRadius: 8,
            fontSize: 15,
          }}
        >
          add chat to my app
        </pre>
        <p>
          The agent reads <code>.agents/skills/cometchat/SKILL.md</code>,
          detects this is a Next.js App Router project, asks 4–5 setup
          questions, and writes a working chat integration into{" "}
          <code>app/</code>.
        </p>
        <p style={{ fontSize: 14, color: "#666" }}>
          <strong>Claude Code users:</strong> after cloning, run{" "}
          <code>npx @cometchat/skills add</code> once — Claude Code reads from{" "}
          <code>.claude/skills/</code> rather than <code>.agents/skills/</code>.
        </p>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 20 }}>What CometChat ships</h2>
        <ul>
          <li>
            <strong>Conversations list, message thread, composer</strong> —
            drop-in React components that handle real-time messaging out of the
            box.
          </li>
          <li>
            <strong>40+ features</strong> — calls, polls, reactions, smart
            replies, translations, AI agents, file sharing, presence.
          </li>
          <li>
            <strong>5 theme presets</strong> — Slack, WhatsApp, iMessage,
            Discord, Notion. Or your own brand color.
          </li>
        </ul>
      </section>

      <section style={{ marginTop: 32, fontSize: 14, color: "#666" }}>
        <p>
          New to CometChat?{" "}
          <a
            href="https://www.cometchat.com/docs"
            target="_blank"
            rel="noreferrer"
          >
            cometchat.com/docs
          </a>{" "}
          ·{" "}
          <a
            href="https://github.com/cometchat/cometchat-skills"
            target="_blank"
            rel="noreferrer"
          >
            skills repo
          </a>
        </p>
      </section>
    </main>
  );
}
