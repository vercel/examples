import { cookies } from 'next/headers';
import { dedupe } from 'flags/next';
import { nanoid } from 'nanoid';

/**
 * Reads the visitor id from the cookie or returns a new visitor id
 */
export const getOrGenerateVisitorId = dedupe(async () => {
  const cookiesStore = await cookies();
  const visitorId = cookiesStore.get('visitor-id')?.value;
  if (!visitorId) return { value: nanoid(), fresh: true };
  return { value: visitorId, fresh: false };
});
