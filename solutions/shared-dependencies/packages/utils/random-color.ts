/**
 * Generates a random color.
 */
export function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

/**
 * Returns either black or white, depending on which has a better
 * contrast with the given color.
 */
export function matchingTextColor(color: string) {
  const r = parseInt(color.substr(1, 2), 16);
  const g = parseInt(color.substr(3, 2), 16);
  const b = parseInt(color.substr(5, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000' : '#fff';
}