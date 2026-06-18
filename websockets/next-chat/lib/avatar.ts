// Avatar color + initials.
//
// Color is hashed off the stable identity (clientId), so two people who pick the
// same nickname get different colors. Initials/label come from the nickname.

const COLORS = [
  '#FF4D4D',
  '#FF8A3D',
  '#F5B300',
  '#3DD68C',
  '#19B5A5',
  '#0BA5EC',
  '#4D6FFF',
  '#8B5CF6',
  '#D946A6',
  '#6E7681',
]

export function colorFor(id: string | null | undefined): string {
  const s = String(id ?? '')
  let hash = 7
  for (let i = 0; i < s.length; i++) {
    hash = s.charCodeAt(i) + (hash << 5) - hash
  }
  return COLORS[Math.abs(hash) % COLORS.length]
}

export function initials(name: string): string {
  return name.trim().slice(0, 2)
}
