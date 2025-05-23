import { cookies, headers } from 'next/headers';
import { dedupe } from 'flags/next';
import { nanoid } from 'nanoid';

/**
 * Reads the stable id from the cookie or returns a new stable id
 */
export const getStableId = dedupe(async () => {
  const cookiesStore = await cookies();
  const header = await headers();

  const generatedStableId = header.get('x-generated-stable-id');

  if (generatedStableId) {
    return { value: generatedStableId, isFresh: false };
  }

  const stableId = cookiesStore.get('stable-id')?.value;
  if (!stableId) return { value: nanoid(), isFresh: true };
  return { value: stableId, isFresh: false };
});