import { protectedProcedure } from '~/server/api/trpc'
import { createComposioClient } from '~/server/clients/composio'

const ONBOARDING_TOOLKITS = [
  {
    slug: 'gmail',
    name: 'Gmail',
    logo: 'https://logos.composio.dev/api/gmail',
  },
  {
    slug: 'github',
    name: 'GitHub',
    logo: 'https://logos.composio.dev/api/github',
  },
  {
    slug: 'slack',
    name: 'Slack',
    logo: 'https://logos.composio.dev/api/slack',
  },
] as const

export const getIntegrationAuthLinks = protectedProcedure.query(
  async ({ ctx }) => {
    const userId = ctx.session.user.id
    const composio = createComposioClient()
    const session = await composio.create(userId, {})
    const toolkitsInfo = await session.toolkits({
      toolkits: ONBOARDING_TOOLKITS.map((t) => t.slug),
    })

    const integrations = await Promise.all(
      ONBOARDING_TOOLKITS.map(async (toolkit) => {
        const info = toolkitsInfo.items.find((i) => i.slug === toolkit.slug)
        const connected = !!info?.connection?.isActive

        let redirectUrl: string | null = null
        if (!connected) {
          try {
            const connectionRequest = await session.authorize(toolkit.slug)
            redirectUrl = connectionRequest.redirectUrl ?? null
          } catch {
            // OAuth URL generation failed -- user can skip
          }
        }

        return {
          toolkit: toolkit.slug,
          name: toolkit.name,
          logo: toolkit.logo,
          connected,
          redirectUrl,
        }
      })
    )

    return { integrations }
  }
)
