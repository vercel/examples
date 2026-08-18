import dotenv from 'dotenv'
import { neon } from '@neondatabase/serverless'

const DEMO_EMAIL = 'demo@neon.dev'
const DEMO_PASSWORD = 'NeonDemo123!'
const DEMO_NAME = 'Demo Publisher'

const SITES = [
  {
    name: 'Northwind Notes',
    subdomain: 'northwind',
    description:
      'A small-kitchen food journal: recipes, markets, and weeknight cooking.',
    authors: [
      {
        name: 'Mira Ellison',
        image:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80',
      },
      {
        name: 'Jonah Peck',
        image:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
      },
    ],
    posts: [
      {
        author: 0,
        title: 'The Tuesday soup that always works',
        image:
          'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1600&q=80',
        imageAlt: 'A steaming pot of vegetable soup on a stove',
        content: `A pot of soup should not require a plan. It should absorb whatever is left in the crisper and still taste like you meant it.

## What goes in

- A yellow onion, chopped without ceremony
- Two carrots and a rib of celery
- A parmesan rind if you have one hiding in the door
- Whatever greens are about to give up

Simmer until the kitchen smells like you live here. Eat it with bread you did not bake. That is the whole method.

> If it needs salt, it needs salt. Taste it while it is still ugly.
`,
      },
      {
        author: 1,
        title: 'A market list for people who hate lists',
        image:
          'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1600&q=80',
        imageAlt: 'Outdoor market stalls stacked with fresh produce',
        content: `Walk the stalls once before you buy anything. The first pass is reconnaissance.

1. Fruit you can eat out of hand
2. One vegetable you do not usually cook
3. Bread for tomorrow's toast

Skip the berries if they look proud of themselves. They will be mush by Thursday.

\`\`\`
tomatoes
eggs
a ridiculous amount of herbs
\`\`\`

Come home and cook the thing that is heaviest.
`,
      },
      {
        author: 0,
        title: 'Toast is a complete meal',
        image:
          'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=1600&q=80',
        imageAlt: 'Toast with fruit and yogurt on a plate',
        content: `People overthink breakfast. Heat a skillet. Butter it. Put bread in it until the edges go dark.

Toppings that count as dinner:

- Ricotta, lemon, black pepper
- Anchovies and a sliced tomato
- Leftover greens and a fried egg

The rule is one crunchy thing and one creamy thing. Everything else is garnish.
`,
      },
    ],
  },
  {
    name: 'Atlas Field Notes',
    subdomain: 'atlas',
    description:
      'Travel sketches from trains, trailheads, and the long way around.',
    authors: [
      {
        name: 'Elena Voss',
        image:
          'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=256&h=256&q=80',
      },
      {
        name: 'Chris Lang',
        image:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
      },
    ],
    posts: [
      {
        author: 0,
        title: 'Six hours on a slow train north',
        image:
          'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1600&q=80',
        imageAlt: 'A passenger train moving through open countryside',
        content: `The fast train is for people with meetings. The slow one is for looking out the window until the landscape repeats.

Pack:

- A paperback you will not finish
- Something salty
- A notebook that can survive being sat on

Stations blur. Someone across the aisle peels an orange and the whole car smells like winter. That is the whole trip, honestly.
`,
      },
      {
        author: 1,
        title: 'How to get lost on purpose',
        image:
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
        imageAlt: 'Sunlight over a mountain valley and winding trail',
        content: `Put the phone in a pocket. Pick a hill. Walk toward it until the streets stop having names.

You will find:

1. A bakery that closes when it feels like it
2. A dog that has opinions about tourists
3. The view you would have skipped for a shortcut

Getting found again is just walking downhill. The map can wait.
`,
      },
      {
        author: 0,
        title: 'Packing for weather that has not decided',
        image:
          'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80',
        imageAlt: 'A lake and mountains under mixed sun and cloud',
        content: `Forecasts are a suggestion. Bring a layer you can hate and still wear.

- A jacket that packs into itself
- Shoes that can get ruined
- One shirt that looks like you tried

Leave the third pair of pants at home. You will buy a postcard instead, and that is the correct trade.
`,
      },
    ],
  },
  {
    name: 'Lumen Lab',
    subdomain: 'lumen',
    description:
      'Essays on type, interfaces, and building software that stays out of the way.',
    authors: [
      {
        name: 'Priya Raman',
        image:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
      },
      {
        name: 'Owen Hart',
        image:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80',
      },
    ],
    posts: [
      {
        author: 0,
        title: 'Buttons should look like they do something',
        image:
          'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1600&q=80',
        imageAlt: 'Color swatches and interface sketches on a desk',
        content: `If a control does not look pressable, people will not press it. That is not a taste argument. It is a physics argument.

## A short list

- Contrast first, brand second
- One primary action per view
- Disabled states that still explain themselves

Ghost buttons are for places you hope nobody needs. Put the real work on a solid fill.
`,
      },
      {
        author: 1,
        title: 'Type that holds a long article',
        image:
          'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80',
        imageAlt: 'Close-up of printed pages and a fountain pen',
        content: `Body text is a reading environment. Measure it like a room.

Aim for:

- ~65 characters a line
- Line height that does not look lonely
- A typeface that does not applaud itself

Headings can be louder. The paragraph has to last. If you get bored setting it, the reader will get bored reading it.
`,
      },
      {
        author: 0,
        title: 'Ship the boring version first',
        image:
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80',
        imageAlt: 'A laptop with code on the screen in a workspace',
        content: `Novelty is a tax. Pay it later.

The first cut of a feature should look slightly underdressed. If people can complete the task, you can dress it. If they cannot, no amount of gradient will help.

\`\`\`
todo:
- make it work
- make it clear
- then make it pretty
\`\`\`

Pretty is a reward for having been understood.
`,
      },
    ],
  },
]

async function ensureDemoUser(authUrl) {
  const base = authUrl.replace(/\/$/, '')
  const paths = ['/sign-up/email', '/api/auth/sign-up/email']
  let last = null
  for (const path of paths) {
    const res = await fetch(`${base}${path}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        name: DEMO_NAME,
      }),
    })
    const text = await res.text()
    last = { path, status: res.status, text: text.slice(0, 400) }
    if (res.ok || res.status === 422 || res.status === 409) return last
  }
  return last
}

dotenv.config({ path: '.env.local' })
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL missing from .env.local')
}
if (!process.env.NEXT_PUBLIC_NEON_AUTH_URL) {
  throw new Error('NEXT_PUBLIC_NEON_AUTH_URL missing from .env.local')
}

const sql = neon(process.env.DATABASE_URL)
const signup = await ensureDemoUser(process.env.NEXT_PUBLIC_NEON_AUTH_URL)
console.log(`auth signup: HTTP ${signup.status} via ${signup.path}`)

const users = await sql`
  select id from neon_auth."user" where email = ${DEMO_EMAIL} limit 1
`
if (!users[0]) {
  throw new Error(`Demo user was not created. Auth response: ${signup.text}`)
}

const ownerId = String(users[0].id)
await sql`
  update neon_auth."user"
  set "emailVerified" = true
  where id = ${users[0].id}
`

const subdomains = SITES.map((site) => site.subdomain)
await sql`
  delete from posts
  where site_id in (select id from sites where subdomain = any(${subdomains}))
`
await sql`
  delete from authors
  where site_id in (select id from sites where subdomain = any(${subdomains}))
`
await sql`
  delete from sites where subdomain = any(${subdomains})
`

for (const site of SITES) {
  const [created] = await sql`
    insert into sites (owner_id, name, subdomain, description)
    values (${ownerId}, ${site.name}, ${site.subdomain}, ${site.description})
    returning id
  `
  const authorIds = []
  for (const author of site.authors) {
    const [row] = await sql`
      insert into authors (site_id, owner_id, name, image_key, image_alt)
      values (
        ${created.id}, ${ownerId}, ${author.name}, ${author.image},
        ${author.imageAlt || `Portrait of ${author.name}`}
      )
      returning id
    `
    authorIds.push(row.id)
  }
  for (const post of site.posts) {
    const authorId = authorIds[post.author]
    const authorName = site.authors[post.author].name
    await sql`
      insert into posts (
        site_id, owner_id, title, author, author_id, content, image_key, image_alt, is_published
      )
      values (
        ${created.id}, ${ownerId}, ${post.title}, ${authorName}, ${authorId},
        ${post.content}, ${post.image}, ${post.imageAlt || post.title}, true
      )
    `
  }
  console.log(`seeded ${site.subdomain} (${site.posts.length} posts)`)
}

console.log(`demo login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`)
