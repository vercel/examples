import { anthropic } from '@ai-sdk/anthropic';
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from 'ai';
import { z } from 'zod';
import { createTransformMCPClient } from '@/lib/mcp';
import { isConfigured } from '@/lib/config';

// Allow streaming responses up to 60 seconds (document parsing can take a moment).
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are a document-processing assistant powered by Unstructured's Transform MCP server.

You have tools that turn files (PDF, DOCX, PPTX, XLSX, HTML, EML, images, and ~70 other formats)
into clean, structured output (markdown, plain text, or element JSON).

When the user gives you a PUBLIC document URL:
1. Call transform_files with that URL, defaulting the output to markdown unless the user asks otherwise.
2. Transforms run as ASYNC jobs. After starting one, call the "wait" tool (a few seconds) BEFORE
   calling check_transform_status. Repeat wait -> check until the status is COMPLETED. Do NOT poll
   status repeatedly without waiting in between — it wastes steps and the job needs time to finish.
3. Once COMPLETED, call get_transform_results. It returns a pre-signed download_url rather than the
   text inline — call the "downloadText" tool on that URL to read the parsed Markdown.
4. Present the content clearly. For long documents, summarize the structure first, then the content.

If the user asks a question without providing a document, ask them for a public URL to a file you can parse.
Never invent document contents — only report what the tools return.`;

const waitTool = tool({
  description:
    'Pause for a few seconds before polling an async job again. Use this between check_transform_status calls so the job has time to finish.',
  inputSchema: z.object({
    seconds: z
      .number()
      .min(1)
      .max(10)
      .describe('How long to pause, in seconds (1-10).'),
  }),
  execute: async ({ seconds }) => {
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    return { waited: seconds };
  },
});

// The download_url from get_transform_results is served from the Transform host.
// Restrict downloads to that host so a crafted prompt cannot turn this tool into
// an SSRF vector (e.g. fetching internal/metadata URLs from the serverless function).
const ALLOWED_DOWNLOAD_HOST = new URL(
  process.env.UNSTRUCTURED_MCP_URL ?? 'https://mcp.transform.unstructured.io',
).host;

const downloadTextTool = tool({
  description:
    'Download transformed output from a pre-signed download_url with an HTTP GET. Use this to read the parsed content returned by get_transform_results.',
  inputSchema: z.object({
    url: z.string().url().describe('The pre-signed download_url from the results.'),
  }),
  execute: async ({ url }) => {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      throw new Error('Invalid download URL.');
    }
    if (parsed.protocol !== 'https:' || parsed.host !== ALLOWED_DOWNLOAD_HOST) {
      throw new Error(
        `Refusing to download from "${parsed.host}": only ${ALLOWED_DOWNLOAD_HOST} over HTTPS is allowed.`,
      );
    }
    // The URL is pre-signed: do not send an Authorization header here.
    const response = await fetch(parsed);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }
    return await response.text();
  },
});

export async function POST(req: Request) {
  // Backstop for a keyless demo deploy (the UI already disables sending):
  // return a clear message instead of a 500 if the keys aren't configured.
  if (!isConfigured()) {
    return new Response(
      'This demo is not configured with API keys. Deploy your own copy with ANTHROPIC_API_KEY and UNSTRUCTURED_API_KEY to use it.',
      { status: 503 },
    );
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const mcpClient = await createTransformMCPClient();

  try {
    const tools = {
      ...(await mcpClient.tools()),
      wait: waitTool,
      downloadText: downloadTextTool,
    };

    const result = streamText({
      model: anthropic('claude-opus-4-8'),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      tools,
      // Async jobs need several wait -> poll cycles; give the loop room.
      stopWhen: stepCountIs(25),
      // Cancel model/tool execution if the client disconnects.
      abortSignal: req.signal,
      // Close the MCP connection when the response finishes, aborts, or errors.
      onEnd: async () => {
        await mcpClient.close();
      },
      onAbort: async () => {
        await mcpClient.close();
      },
      onError: async () => {
        await mcpClient.close();
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    await mcpClient.close();
    throw error;
  }
}
