import { defineAgent, defineDynamic } from 'eve'
import { createGatewayProvider } from '@ai-sdk/gateway'
import { DEFAULT_MODEL } from '../ai/constants'

const gateway = createGatewayProvider({
  headers: {
    'http-referer': 'https://oss-vibe-coding-platform.vercel.app/',
    'x-title': 'Vibe Coding Platform',
  },
})

export default defineAgent({
  defaultTools: false,
  tool: false,
  model: defineDynamic({
    events: {
      'step.started': (_event, ctx) => ({
        model: gateway(
          String(ctx.session.auth.current?.attributes.modelId ?? DEFAULT_MODEL)
        ),
        reasoning:
          ctx.session.auth.current?.attributes.reasoningEffort === 'medium'
            ? ('medium' as const)
            : ('low' as const),
      }),
    },
  }),
})
