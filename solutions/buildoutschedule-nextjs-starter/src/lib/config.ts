/**
 * The booking page this starter embeds. The default points at a live demo
 * workspace so the widget works the moment you run `pnpm dev`.
 *
 * To point it at your own workspace, set the two env vars (see .env.example)
 * or edit the fallbacks here. Your booking URL is
 * https://buildoutschedule.com/{workspace}/{eventType}.
 */
export const scheduleConfig = {
  workspace: process.env.NEXT_PUBLIC_SCHEDULE_WORKSPACE ?? 'chase',
  eventType:
    process.env.NEXT_PUBLIC_SCHEDULE_EVENT_TYPE ?? 'buildout-studios-consultation',
} as const;
