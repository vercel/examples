export type TarotCard = {
  number: number
  name: string
  arcana: 'Major' | 'Minor'
  upright: string
  reversed: string
  guideUrl: string
}

// Minimal starter deck — full 78-card dataset available at
// https://huggingface.co/datasets/Blacik/deckaura-tarot-card-meanings
export const CARDS: TarotCard[] = [
  {
    number: 0,
    name: 'The Fool',
    arcana: 'Major',
    upright: 'New beginnings, innocence, adventure, free spirit',
    reversed: 'Recklessness, fear of change, holding back',
    guideUrl: 'https://deckaura.com/blogs/guide/fool-tarot-meaning',
  },
  {
    number: 1,
    name: 'The Magician',
    arcana: 'Major',
    upright: 'Manifestation, willpower, resourcefulness',
    reversed: 'Manipulation, poor planning, untapped talents',
    guideUrl: 'https://deckaura.com/blogs/guide/magician-tarot-meaning',
  },
  {
    number: 2,
    name: 'The High Priestess',
    arcana: 'Major',
    upright: 'Intuition, mystery, inner wisdom, subconscious',
    reversed: 'Secrets, disconnection from intuition',
    guideUrl: 'https://deckaura.com/blogs/guide/high-priestess-tarot-meaning',
  },
  {
    number: 3,
    name: 'The Empress',
    arcana: 'Major',
    upright: 'Abundance, nurturing, fertility, beauty',
    reversed: 'Insecurity, neglect, creative block',
    guideUrl: 'https://deckaura.com/blogs/guide/empress-tarot-meaning',
  },
  {
    number: 21,
    name: 'The World',
    arcana: 'Major',
    upright: 'Completion, integration, accomplishment, travel',
    reversed: 'Incompletion, shortcuts, delays',
    guideUrl: 'https://deckaura.com/blogs/guide/world-tarot-meaning',
  },
]

export function drawRandom(): TarotCard {
  return CARDS[Math.floor(Math.random() * CARDS.length)]!
}

export function findCard(name: string): TarotCard | undefined {
  const q = name.toLowerCase().trim()
  return CARDS.find((c) => c.name.toLowerCase() === q)
}
