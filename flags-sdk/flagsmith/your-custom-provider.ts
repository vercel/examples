import {
  type Provider,
  type ResolutionDetails,
  type EvaluationContext,
  type JsonValue,
  OpenFeatureEventEmitter,
} from '@openfeature/server-sdk'
import { xxHash32 } from 'js-xxhash'

/**
 * Selects a value from an array of options based on the targeting key using xxHash32
 * @param targetingKey The key to use for targeting
 * @param options Array of available options
 * @returns The selected option
 */
function selectTargetedOption<T>(
  flagKey: string,
  targetingKey: string,
  options: T[]
): T {
  const index = xxHash32(`${flagKey}:${targetingKey}`) % options.length
  return options[index]
}

/**
 * A custom OpenFeature provider that uses a static configuration.
 *
 * This is a simple example of how to implement a custom provider.
 * It is not intended to be used as a real provider.
 */
export class MyFeatureProvider implements Provider {
  readonly metadata = {
    name: 'My Feature Provider',
  } as const

  readonly runsOn = 'server'

  config: Record<string, boolean | string | number | JsonValue>

  constructor(config: Record<string, boolean | string | number | JsonValue>) {
    this.config = config
  }

  // emitter for provider events
  events = new OpenFeatureEventEmitter()

  resolveBooleanEvaluation(
    flagKey: string,
    defaultValue: boolean,
    context: EvaluationContext
  ): Promise<ResolutionDetails<boolean>> {
    const config = this.config[flagKey]

    if (typeof config === 'boolean') {
      return Promise.resolve({ value: config, reason: 'STATIC' })
    }

    if (Array.isArray(config) && context.targetingKey) {
      return Promise.resolve({
        value: selectTargetedOption(
          flagKey,
          context.targetingKey,
          config as boolean[]
        ),
        reason: 'SPLIT',
      })
    }

    return Promise.resolve({ value: defaultValue, reason: 'DEFAULT' })
  }

  resolveStringEvaluation(
    flagKey: string,
    defaultValue: string,
    context: EvaluationContext
  ): Promise<ResolutionDetails<string>> {
    const config = this.config[flagKey]

    if (typeof config === 'string') {
      return Promise.resolve({ value: config, reason: 'STATIC' })
    }

    if (Array.isArray(config) && context.targetingKey) {
      return Promise.resolve({
        value: selectTargetedOption(
          flagKey,
          context.targetingKey,
          config as string[]
        ),
        reason: 'SPLIT',
      })
    }

    return Promise.resolve({ value: defaultValue, reason: 'DEFAULT' })
  }

  resolveNumberEvaluation(
    flagKey: string,
    defaultValue: number,
    context: EvaluationContext
  ): Promise<ResolutionDetails<number>> {
    const config = this.config[flagKey]

    if (typeof config === 'number') {
      return Promise.resolve({ value: config, reason: 'STATIC' })
    }

    if (Array.isArray(config) && context.targetingKey) {
      return Promise.resolve({
        value: selectTargetedOption(
          flagKey,
          context.targetingKey,
          config as number[]
        ),
        reason: 'SPLIT',
      })
    }

    return Promise.resolve({ value: defaultValue, reason: 'DEFAULT' })
  }

  resolveObjectEvaluation<T = JsonValue>(
    flagKey: string,
    defaultValue: T,
    context: EvaluationContext
  ): Promise<ResolutionDetails<T>> {
    const value = this.config[flagKey] ?? defaultValue
    return Promise.resolve({
      value: value as T,
      reason: 'STATIC',
    })
  }
}
