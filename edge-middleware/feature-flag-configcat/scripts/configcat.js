const { join } = require('path')
const { writeFile } = require('fs/promises')
const prettier = require('prettier')
const configcat = require('configcat-node')
const {
  ConfigFile,
  Preferences,
  Setting,
  RolloutRules,
  RolloutPercentageItems,
} = require('configcat-common/lib/ProjectConfig')

async function setupConfigcat() {
  if (!process.env.NEXT_PUBLIC_CONFIGCAT_SDK_KEY) {
    throw new Error(
      'NEXT_PUBLIC_CONFIGCAT_SDK_KEY is missing in environment variables'
    )
  }

  const logger = configcat.createConsoleLogger(3)
  // We only need to setup the client once so polling is not required
  const configCatClient = configcat.createClientWithManualPoll(
    process.env.NEXT_PUBLIC_CONFIGCAT_SDK_KEY,
    { logger: logger }
  )

  // This action takes more then 350ms, trying to fetch Configcat' config
  // at runtime would be too expensive
  await configCatClient.forceRefreshAsync()

  const { ConfigJSON } = await configCatClient.configService.getConfig()
  const flags = ConfigJSON[ConfigFile.FeatureFlags]
  const data = Object.entries({
    // Maps for the config
    ConfigFile,
    Preferences,
    Setting,
    RolloutRules,
    RolloutPercentageItems,
    // This is the actual config
    ConfigJSON,
  }).reduce((obj, [k, v]) => {
    // Move static methods in classes to an object
    obj[k] = { ...v }
    return obj
  }, {})
  const filePath = join(process.cwd(), 'lib/config.json')
  const content = prettier.format(JSON.stringify(data), { parser: 'json' })

  await writeFile(filePath, content)
}

function withConfigcat(nextConfig = {}) {
  const { rewrites } = nextConfig
  // Not really adding rewrites but using its async behavior to load the config from configcat
  nextConfig.rewrites = async (...args) => {
    await setupConfigcat()
    return rewrites?.(...args) ?? {}
  }

  return nextConfig
}

module.exports = { withConfigcat, setupConfigcat }
