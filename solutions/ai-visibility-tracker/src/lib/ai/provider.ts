import { gateway, type LanguageModel } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { perplexity } from '@ai-sdk/perplexity'
import { xai } from '@ai-sdk/xai'
import {
  PLATFORM_IDS,
  extractorModelId,
  platformModelId,
  type ModelConfig,
  type PlatformId,
} from '@/lib/platforms'

export type Transport = 'gateway' | 'direct'
export type Vendor = 'openai' | 'anthropic' | 'google' | 'xai' | 'perplexity'

const VENDORS: Vendor[] = ['openai', 'anthropic', 'google', 'xai', 'perplexity']

export const VENDOR_KEY_ENV: Record<Vendor, string> = {
  openai: 'OPENAI_API_KEY',
  anthropic: 'ANTHROPIC_API_KEY',
  google: 'GOOGLE_GENERATIVE_AI_API_KEY',
  xai: 'XAI_API_KEY',
  perplexity: 'PERPLEXITY_API_KEY',
}

/**
 * Gateway when a gateway key is set or the app runs on Vercel (OIDC), otherwise
 * direct vendor calls with the vendor's own key.
 */
export function transport(): Transport {
  return process.env.AI_GATEWAY_API_KEY || process.env.VERCEL
    ? 'gateway'
    : 'direct'
}

export function vendorOf(modelId: string): Vendor | null {
  const prefix = modelId.split('/')[0]
  return (VENDORS as string[]).includes(prefix) ? (prefix as Vendor) : null
}

export interface ModelAvailability {
  modelId: string
  transport: Transport
  available: boolean
  reason: string | null
}

export function modelAvailability(modelId: string): ModelAvailability {
  const mode = transport()
  if (mode === 'gateway') {
    return { modelId, transport: mode, available: true, reason: null }
  }
  const vendor = vendorOf(modelId)
  if (!vendor) {
    return {
      modelId,
      transport: mode,
      available: false,
      reason: `Unknown vendor in "${modelId}". Direct calls support ${VENDORS.join(
        ', '
      )}.`,
    }
  }
  const envName = VENDOR_KEY_ENV[vendor]
  if (!process.env[envName]) {
    return {
      modelId,
      transport: mode,
      available: false,
      reason: `Set AI_GATEWAY_API_KEY or ${envName}.`,
    }
  }
  return { modelId, transport: mode, available: true, reason: null }
}

export type PlatformAvailability = ModelAvailability & { id: PlatformId }

export function platformAvailability(
  id: PlatformId,
  modelId: string = platformModelId(id)
): PlatformAvailability {
  return { id, ...modelAvailability(modelId) }
}

export function availablePlatforms(config?: ModelConfig): PlatformId[] {
  return PLATFORM_IDS.filter(
    (id) => platformAvailability(id, config?.platforms[id]).available
  )
}

export function extractorAvailability(
  modelId: string = extractorModelId()
): ModelAvailability {
  return modelAvailability(modelId)
}

export function languageModel(modelId: string): LanguageModel {
  if (transport() === 'gateway') {
    return gateway(modelId)
  }
  const vendor = vendorOf(modelId)
  if (!vendor) {
    throw new Error(
      `Cannot route "${modelId}" without the AI Gateway: unknown vendor prefix.`
    )
  }
  const bare = modelId.slice(vendor.length + 1)
  switch (vendor) {
    case 'openai':
      return openai(bare)
    case 'anthropic':
      return anthropic(bare)
    case 'google':
      return google(bare)
    case 'xai':
      return xai(bare)
    case 'perplexity':
      // The Perplexity Agent API expects vendor-prefixed ids such as perplexity/sonar.
      return perplexity(modelId)
  }
}
