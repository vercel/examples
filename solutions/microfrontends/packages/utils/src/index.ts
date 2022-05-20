/**
 * Generates a random color.
 */
export function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}

/**
 * Returns either black or white, depending on which has a better
 * contrast with the given color.
 *
 * It doesn't work well for all colors but it's sufficient for
 * our demo purposes.
 */
export function matchingTextColor(color: string) {
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  return yiq >= 128 ? '#000' : '#fff'
}
