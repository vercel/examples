import type { Adapter } from 'flags'
import {
  createLaunchDarklyAdapter,
  type LDContext,
} from '@flags-sdk/launchdarkly'

export type { LDContext }

/**
 * This adapter supports two ways of reading LaunchDarkly flags, and picks one
 * automatically based on which environment variables are present:
 *
 * 1. Edge Config mode (`EDGE_CONFIG` + `LAUNCHDARKLY_CLIENT_SIDE_ID`): reads
 *    flags from a Vercel Edge Config store using `@flags-sdk/launchdarkly`.
 *    This is edge-native and the lowest latency, and is what the LaunchDarkly
 *    Vercel Marketplace integration is designed for.
 *
 * 2. Server SDK mode (`LAUNCHDARKLY_SDK_KEY`): talks to LaunchDarkly directly
 *    using `@launchdarkly/node-server-sdk`. This requires no Edge Config, so
 *    the template works with just the SDK key.
 *
 * Edge Config mode is preferred when both are configured.
 */

const edgeConfigConnectionString = process.env.EDGE_CONFIG
const clientSideId = process.env.LAUNCHDARKLY_CLIENT_SIDE_ID
const projectSlug = process.env.LAUNCHDARKLY_PROJECT_SLUG
const sdkKey = process.env.LAUNCHDARKLY_SDK_KEY

/** Links a flag to its details page in the LaunchDarkly console. */
function flagOrigin(key: string): string | undefined {
  return projectSlug
    ? `https://app.launchdarkly.com/projects/${projectSlug}/flags/${key}/`
    : undefined
}

/** The subset of the LaunchDarkly client this app relies on. */
interface LDClientLike {
  waitForInitialization(): Promise<unknown>
  allFlagsState(
    context: LDContext,
  ): Promise<{ toJSON(): unknown } | undefined>
}

interface LDAdapterLike {
  variation<ValueType = unknown>(): Adapter<ValueType, LDContext>
  ldClient: LDClientLike
}

function createEdgeConfigAdapter(): LDAdapterLike {
  return createLaunchDarklyAdapter({
    projectSlug: projectSlug ?? '',
    clientSideId: clientSideId!,
    edgeConfigConnectionString: edgeConfigConnectionString!,
  }) as unknown as LDAdapterLike
}

function createServerSdkAdapter(): LDAdapterLike {
  // Lazily initialize a single client so we only connect when this mode runs.
  let clientPromise:
    | Promise<import('@launchdarkly/node-server-sdk').LDClient>
    | undefined

  async function getClient() {
    if (!clientPromise) {
      clientPromise = import('@launchdarkly/node-server-sdk').then(
        async ({ init }) => {
          const client = init(sdkKey!)
          await client.waitForInitialization({ timeout: 10 })
          return client
        },
      )
    }
    return clientPromise
  }

  return {
    variation<ValueType = unknown>(): Adapter<ValueType, LDContext> {
      return {
        origin: flagOrigin,
        async decide({ key, entities, defaultValue }) {
          const client = await getClient()
          const context: LDContext =
            entities ?? { kind: 'user', key: 'anonymous', anonymous: true }
          return client.variation(
            key,
            context,
            defaultValue,
          ) as Promise<ValueType>
        },
      }
    },
    ldClient: {
      waitForInitialization: () => getClient(),
      async allFlagsState(context: LDContext) {
        const client = await getClient()
        return (await client.allFlagsState(context)) as unknown as {
          toJSON(): unknown
        }
      },
    },
  }
}

let resolved: LDAdapterLike | undefined

// Resolve the mode lazily (on first use) so importing this module never throws
// at build time when env vars are not yet available.
function adapter(): LDAdapterLike {
  if (resolved) return resolved
  if (edgeConfigConnectionString && clientSideId) {
    resolved = createEdgeConfigAdapter()
  } else if (sdkKey) {
    resolved = createServerSdkAdapter()
  } else {
    throw new Error(
      'LaunchDarkly is not configured. Set EDGE_CONFIG and LAUNCHDARKLY_CLIENT_SIDE_ID ' +
        'for Edge Config mode, or LAUNCHDARKLY_SDK_KEY for server SDK mode.',
    )
  }
  return resolved
}

export const ldAdapter: LDAdapterLike = {
  variation<ValueType = unknown>(): Adapter<ValueType, LDContext> {
    let inner: Adapter<ValueType, LDContext> | undefined
    return {
      origin: flagOrigin,
      decide(options) {
        if (!inner) inner = adapter().variation<ValueType>()
        return inner.decide(options)
      },
    }
  },
  ldClient: {
    waitForInitialization: () => adapter().ldClient.waitForInitialization(),
    allFlagsState: (context) => adapter().ldClient.allFlagsState(context),
  },
}
