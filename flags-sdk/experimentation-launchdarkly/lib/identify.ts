import type { Identify } from 'flags';
import type { LDContext } from '@flags-sdk/launchdarkly';
import { dedupe } from 'flags/next';
import { getStableId } from './get-stable-id';

export const identify = dedupe(async () => {
  const stableId = await getStableId();

  return {
    kind: 'user',
    key: stableId.value,
  };
}) satisfies Identify<LDContext>;
