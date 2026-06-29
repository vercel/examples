import type { Peer } from '../../shared/types/realtime'

const ADJECTIVES = [
  'Swift', 'Calm', 'Brave', 'Lucky', 'Clever', 'Witty', 'Bright', 'Mellow',
  'Nimble', 'Sunny', 'Cosmic', 'Vivid', 'Bold', 'Jolly', 'Keen', 'Snappy',
]

const ANIMALS = [
  'Otter', 'Falcon', 'Panda', 'Lynx', 'Heron', 'Fox', 'Gecko', 'Tapir',
  'Koala', 'Raven', 'Bison', 'Moth', 'Newt', 'Quokka', 'Ibis', 'Wren',
]

/**
 * Builds a fresh anonymous identity for a new connection — no auth required.
 * Swap this for your authenticated user when adapting the starter.
 */
export function createIdentity(): Peer {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
  // Spread the hue across the wheel for distinct, readable cursor colors.
  const hue = Math.floor(Math.random() * 360)

  return {
    id: crypto.randomUUID(),
    name: `${adjective} ${animal}`,
    color: `hsl(${hue} 85% 60%)`,
  }
}
