// Minimal proxy from the browser to your Auxen instance. Auxen exposes the
// OpenAI Chat Completions wire format on every instance, so the only thing
// this route does is forward the messages, add the bearer token, and stream
// the SSE response back to the client unchanged.

export const runtime = "edge";
export const maxDuration = 30;

interface ChatRequest {
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
}

export async function POST(req: Request) {
  const { messages }: ChatRequest = await req.json();

  const base = process.env.AUXEN_API_BASE;
  const key = process.env.AUXEN_API_KEY;
  const model = process.env.AUXEN_MODEL ?? "llama-3.1-8b";

  if (!base || !key) {
    return new Response(
      JSON.stringify({
        error:
          "Auxen credentials missing. Set AUXEN_API_BASE and AUXEN_API_KEY env vars (get them from https://auxen.ai).",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const upstream = await fetch(`${base.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ model, messages, stream: true }),
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text();
    return new Response(
      JSON.stringify({ error: text || `Auxen returned ${upstream.status}` }),
      { status: upstream.status, headers: { "Content-Type": "application/json" } },
    );
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
