# Known Issues

| ID | Issue | Severity | Status |
|----|-------|----------|--------|
| A | Demo form inputs missing styles | High | Mitigated |
| B | "Created by Vercel" text incorrect | High | Mitigated |

## A. Demo form inputs missing styles

**Severity**: High (blocks PR approval)
**Status**: Mitigated — Tailwind classes applied to all form elements in `app/page.tsx` and `app/process/page.tsx`

The contact form on the live demo (aws-message-queue-elasticache.vercel.app) had unstyled `<input>` and `<textarea>` elements. Reviewer Paul Murray flagged this in Slack (Jun 29, 2026) with a screenshot showing bare browser-default form controls.

**Resolution**: Replaced all inline styles with Tailwind utility classes — borders, rounded corners, focus rings, proper spacing, hover/disabled states on buttons, status message styling.

## B. "Created by Vercel" text incorrect

**Severity**: High (blocks PR approval)
**Status**: Mitigated — CSS override in `app/layout.tsx` replaces "Created by" with "Built with"

The demo footer displayed "Created by Vercel". Paul flagged this in Slack (Jun 29, 2026): should say "with Vercel" or "on Vercel", not "by Vercel". The text is hardcoded in the `@vercel/examples-ui` Layout component footer with no override prop.

**Resolution**: Added a `<style>` block in `app/layout.tsx` that hides the span text via `visibility: hidden` and injects "Built with" via `::after` pseudo-element. The Layout component is still used (preserving the nav bar), only the footer text is overridden.
