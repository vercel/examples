import c from './config.json'

// config.json has these as `string` so we convert them here to avoid type issues
const FeatureFlags = c.ConfigFile.FeatureFlags as 'f'
const RolloutPercentageItems = c.Setting.RolloutPercentageItems as 'p'
const Value = c.Setting.Value as 'v'

export type FlagsConfig = typeof c.ConfigJSON.f

export type Flags = keyof FlagsConfig

export type FlagsMatcher = {
  [x: string]:
    | {
        cookie: string
        name: Flags
        rewrite(enabled: boolean): string
      }
    | undefined
}

const flagsConfig: FlagsConfig = c.ConfigJSON[FeatureFlags]

/**
 * Returns a value from the cached config, if the value has a target set it will
 * randomly pick one based on each target' percentage
 */
export function getValue<K extends Flags>(key: K): boolean {
  const setting = flagsConfig[key]
  const percentageItems = setting[RolloutPercentageItems]

  if (!percentageItems.length) {
    return setting[Value]
  }

  let n = cryptoRandom() * 100

  return (
    percentageItems.find((item) => {
      n -= item[RolloutPercentageItems]
      return n <= 0
    })?.[Value] ?? setting[Value]
  )
}

function cryptoRandom() {
  return crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)
}
