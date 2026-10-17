import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  RESOURCE_MIME_TYPE,
  registerAppResource,
  registerAppTool,
} from '@modelcontextprotocol/ext-apps/server';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKENLAB_API_BASE = (process.env.TOKENLAB_API_BASE || 'https://api.tokenlab.sh').replace(/\/+$/, '');
const PORT = Number(process.env.PORT || 8000);
const WIDGET_URI = 'ui://tokenlab/model-explorer.html';

type TokenLabModelsIndex = {
  categories?: Record<string, { models?: string[] }>;
};

type TokenLabPricingIndex = {
  data?: Array<{
    model: string;
    provider?: string;
    pricing_unit?: string;
    platform?: {
      input_per_1m?: string | null;
      output_per_1m?: string | null;
      per_request?: string | null;
    };
  }>;
};

type ExplorerModel = {
  id: string;
  category: string;
  provider?: string;
  pricing_unit?: string;
  input_per_1m?: string | null;
  output_per_1m?: string | null;
  per_request?: string | null;
};

async function readWidgetHtml(): Promise<string> {
  return fs.readFile(path.join(__dirname, 'widget.html'), 'utf8');
}

async function fetchJson<T>(pathname: string): Promise<T> {
  const response = await fetch(`${TOKENLAB_API_BASE}${pathname}`);
  if (!response.ok) {
    throw new Error(`TokenLab ${pathname} returned ${response.status}`);
  }
  return response.json() as Promise<T>;
}

function pickModels(index: TokenLabModelsIndex, category: string | undefined, query: string | undefined): ExplorerModel[] {
  const categories = index.categories || {};
  const entries = Object.entries(categories)
    .filter(([name]) => !category || name === category)
    .flatMap(([name, value]) => (value.models || []).map((id) => ({ id, category: name })));
  const normalizedQuery = query?.trim().toLowerCase();
  const filtered = normalizedQuery
    ? entries.filter((model) => model.id.toLowerCase().includes(normalizedQuery))
    : entries;
  return filtered.slice(0, 24);
}

function mergePricing(models: ExplorerModel[], pricing: TokenLabPricingIndex): ExplorerModel[] {
  const priceByModel = new Map((pricing.data || []).map((entry) => [entry.model, entry]));
  return models.map((model) => {
    const price = priceByModel.get(model.id);
    if (!price) return model;
    return {
      ...model,
      provider: price.provider,
      pricing_unit: price.pricing_unit,
      input_per_1m: price.platform?.input_per_1m ?? null,
      output_per_1m: price.platform?.output_per_1m ?? null,
      per_request: price.platform?.per_request ?? null,
    };
  });
}

function endpointExample(endpoint: string, model: string): string {
  if (endpoint === 'anthropic_messages') {
    return `curl ${TOKENLAB_API_BASE}/v1/messages \\
  -H "Authorization: Bearer $TOKENLAB_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"${model}","max_tokens":512,"messages":[{"role":"user","content":"Hello from TokenLab"}]}'`;
  }

  if (endpoint === 'gemini_generate_content') {
    return `curl ${TOKENLAB_API_BASE}/v1beta/models/${model}:generateContent \\
  -H "Authorization: Bearer $TOKENLAB_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"contents":[{"role":"user","parts":[{"text":"Hello from TokenLab"}]}]}'`;
  }

  if (endpoint === 'responses') {
    return `curl ${TOKENLAB_API_BASE}/v1/responses \\
  -H "Authorization: Bearer $TOKENLAB_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"${model}","input":"Hello from TokenLab"}'`;
  }

  return `curl ${TOKENLAB_API_BASE}/v1/chat/completions \\
  -H "Authorization: Bearer $TOKENLAB_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"${model}","messages":[{"role":"user","content":"Hello from TokenLab"}]}'`;
}

function createTokenLabAppsServer(): McpServer {
  const server = new McpServer({
    name: 'tokenlab-model-explorer-app',
    version: '0.1.0',
  });

  registerAppResource(
    server,
    'TokenLab Model Explorer',
    WIDGET_URI,
    {
      description: 'Interactive model, pricing, and endpoint explorer for TokenLab.',
      _meta: {
        ui: {
          csp: {
            connectDomains: [TOKENLAB_API_BASE],
            resourceDomains: [],
          },
          prefersBorder: true,
        },
      },
    },
    async () => ({
      contents: [
        {
          uri: WIDGET_URI,
          mimeType: RESOURCE_MIME_TYPE,
          text: await readWidgetHtml(),
          _meta: {
            ui: {
              csp: {
                connectDomains: [TOKENLAB_API_BASE],
                resourceDomains: [],
              },
              prefersBorder: true,
            },
          },
        },
      ],
    }),
  );

  registerAppTool(
    server,
    'open_tokenlab_model_explorer',
    {
      title: 'Open TokenLab Model Explorer',
      description: 'Browse TokenLab models by category or search query.',
      inputSchema: {
        category: z.enum(['text', 'image', 'video', 'audio', 'embedding']).optional(),
        query: z.string().optional(),
      },
      annotations: { readOnlyHint: true },
      _meta: {
        ui: { resourceUri: WIDGET_URI },
      },
    },
    async ({ category, query }) => {
      const [modelIndex, pricingIndex] = await Promise.all([
        fetchJson<TokenLabModelsIndex>('/models.json'),
        fetchJson<TokenLabPricingIndex>('/pricing.json'),
      ]);
      const models = mergePricing(pickModels(modelIndex, category, query), pricingIndex);
      return {
        content: [
          {
            type: 'text',
            text: `Found ${models.length} TokenLab models${category ? ` in ${category}` : ''}.`,
          },
        ],
        structuredContent: {
          category: category || 'all',
          query: query || null,
          models,
        },
      };
    },
  );

  registerAppTool(
    server,
    'compare_tokenlab_models',
    {
      title: 'Compare TokenLab Models',
      description: 'Compare pricing metadata for specific TokenLab model IDs.',
      inputSchema: {
        models: z.array(z.string()).min(1).max(8),
      },
      annotations: { readOnlyHint: true },
      _meta: {
        ui: { resourceUri: WIDGET_URI },
      },
    },
    async ({ models }) => {
      const pricingIndex = await fetchJson<TokenLabPricingIndex>('/pricing.json');
      const wanted = new Set(models);
      const compared = (pricingIndex.data || [])
        .filter((entry) => wanted.has(entry.model))
        .map((entry) => ({
          id: entry.model,
          category: 'pricing',
          provider: entry.provider,
          pricing_unit: entry.pricing_unit,
          input_per_1m: entry.platform?.input_per_1m ?? null,
          output_per_1m: entry.platform?.output_per_1m ?? null,
          per_request: entry.platform?.per_request ?? null,
        }));

      return {
        content: [
          {
            type: 'text',
            text: compared.length > 0
              ? `Compared ${compared.length} TokenLab models.`
              : 'No matching TokenLab models found in pricing.json.',
          },
        ],
        structuredContent: {
          category: 'pricing',
          models: compared,
        },
      };
    },
  );

  registerAppTool(
    server,
    'generate_tokenlab_endpoint_example',
    {
      title: 'Generate TokenLab Endpoint Example',
      description: 'Generate a copyable cURL example for OpenAI-compatible or native TokenLab endpoints.',
      inputSchema: {
        endpoint: z.enum(['chat_completions', 'responses', 'anthropic_messages', 'gemini_generate_content']),
        model: z.string().default('gpt-5.5'),
      },
      annotations: { readOnlyHint: true },
      _meta: {
        ui: { resourceUri: WIDGET_URI },
      },
    },
    async ({ endpoint, model }) => {
      const example = endpointExample(endpoint, model);
      return {
        content: [{ type: 'text', text: example }],
        structuredContent: {
          category: 'example',
          models: [{ id: model, category: endpoint }],
          example,
        },
      };
    },
  );

  return server;
}

async function handleMcpRequest(request: express.Request, response: express.Response): Promise<void> {
  const server = createTokenLabAppsServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  response.on('close', () => {
    void transport.close();
    void server.close();
  });

  await server.connect(transport);
  await transport.handleRequest(request, response, request.body);
}

export function createHttpApp() {
  const app = express();
  app.use(cors({
    origin: '*',
    exposedHeaders: ['mcp-session-id'],
  }));
  app.use(express.json({ limit: '2mb' }));

  app.get('/', (_request, response) => {
    response.json({
      name: 'TokenLab Model Explorer App',
      mcp: '/mcp',
      widget_preview: '/widget',
      tokenlab_api_base: TOKENLAB_API_BASE,
    });
  });

  app.get('/widget', async (_request, response) => {
    response.type('html').send(await readWidgetHtml());
  });

  app.all('/mcp', async (request, response, next) => {
    try {
      await handleMcpRequest(request, response);
    } catch (error) {
      next(error);
    }
  });

  return app;
}

const app = createHttpApp();
export default app;

if (process.argv.includes('--smoke')) {
  createTokenLabAppsServer();
  console.log('tokenlab model explorer app ok');
} else if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`TokenLab Model Explorer App listening on http://localhost:${PORT}`);
    console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
  });
}
