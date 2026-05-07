import {
  MercadoPagoClient,
  mercadoPagoTools,
  InMemoryStateAdapter,
} from "@ar-agents/mercadopago";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";

export const runtime = "edge";

const client = new MercadoPagoClient({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const tools = mercadoPagoTools(client, {
  state: new InMemoryStateAdapter(),
  backUrl: process.env.NEXT_PUBLIC_BACK_URL ?? "https://example.com/done",
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    // Vercel AI Gateway routes by string model name; no provider package needed.
    model: "anthropic/claude-sonnet-4-6",
    system:
      "Sos un asistente de billing para una SaaS argentina. " +
      "Usás los tools de @ar-agents/mercadopago para crear suscripciones, " +
      "cobrar pagos, y consultar estado. Respondé en español rioplatense, " +
      "sin emojis, breve.",
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(8),
  });

  return result.toUIMessageStreamResponse();
}
