/** Join class names, dropping falsy ones. Small helper for conditional Tailwind
 *  classes (no dependency needed for this app's needs). */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(' ')
}
