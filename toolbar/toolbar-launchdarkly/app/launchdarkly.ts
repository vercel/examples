import * as LaunchDarkly from '@launchdarkly/node-server-sdk'
let launchDarklyClient: LaunchDarkly.LDClient

async function initialize() {
  launchDarklyClient = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY!)
  return launchDarklyClient.waitForInitialization()
}

export async function getClient(): Promise<LaunchDarkly.LDClient> {
  if (launchDarklyClient) {
    await launchDarklyClient.waitForInitialization()
    return launchDarklyClient
  }
  await initialize()
  return launchDarklyClient
}
