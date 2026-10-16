'use client';

import { useEffect, useState } from 'react';

/**
 * Formats an ISO timestamp in the visitor's own timezone. Runs after mount
 * so the server never guesses a timezone it can't know.
 */
export function LocalTime({ iso }: { iso: string }) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return;
    setLabel(
      new Intl.DateTimeFormat(undefined, {
        dateStyle: 'full',
        timeStyle: 'short',
      }).format(date),
    );
  }, [iso]);

  if (!label) return null;

  return <p className="text-lg font-medium text-ink">{label}</p>;
}
