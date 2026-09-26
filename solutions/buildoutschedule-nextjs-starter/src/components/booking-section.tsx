'use client';

import { BookingWidget, type BookedEvent } from '@buildoutstudios/schedule';
import { useRouter } from 'next/navigation';

interface BookingSectionProps {
  workspace: string;
  eventType: string;
}

/**
 * Client wrapper around the booking widget. The widget listens for the
 * hosted page's postMessage, so it has to render on the client; the page
 * itself stays a server component.
 */
export function BookingSection({ workspace, eventType }: BookingSectionProps) {
  const router = useRouter();

  function handleBooked(booking: BookedEvent) {
    router.push(`/thanks?start=${encodeURIComponent(booking.startsAt)}`);
  }

  return (
    <BookingWidget
      workspace={workspace}
      eventType={eventType}
      onBooked={handleBooked}
      height={720}
      title="Book a time"
    />
  );
}
