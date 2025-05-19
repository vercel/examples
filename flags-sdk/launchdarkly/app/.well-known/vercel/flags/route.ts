import { mergeProviderData } from 'flags';
import { getProviderData, createFlagsDiscoveryEndpoint } from 'flags/next';
import { getProviderData as getLDProviderData } from '@flags-sdk/launchdarkly';
import * as flags from '../../../../flags';

export const GET = createFlagsDiscoveryEndpoint(async (request) => {
  const otherData = getProviderData(flags);
  if (
    !process.env.LAUNCHDARKLY_API_KEY ||
    !process.env.LAUNCHDARKLY_PROJECT_KEY ||
    !process.env.LAUNCHDARKLY_ENVIRONMENT
  ) {
    return otherData;
  }
  const ldData = await getLDProviderData({
    apiKey: process.env.LAUNCHDARKLY_API_KEY,
    projectKey: process.env.LAUNCHDARKLY_PROJECT_KEY,
    environment: process.env.LAUNCHDARKLY_ENVIRONMENT,
  });
  return mergeProviderData([otherData, ldData]);
});
