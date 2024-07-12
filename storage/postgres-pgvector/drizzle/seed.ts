import 'dotenv/config'
import { db } from './db'
import { pokemons } from './schema'
import { eq } from 'drizzle-orm'
import { openai } from '../lib/openai'
import pokemon from './pokemon-with-embeddings.json'
import { embed } from 'ai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('process.env.OPENAI_API_KEY is not defined. Please set it.')
}

if (!process.env.POSTGRES_URL) {
  throw new Error('process.env.POSTGRES_URL is not defined. Please set it.')
}

async function main() {
  try {
    const pika = await db.query.pokemons.findFirst({
      where: (pokemons, { eq }) => eq(pokemons.name, 'Pikachu'),
    })

    if (pika) {
      console.log('Pokédex already seeded!')
      return
    }
  } catch (error) {
    console.error('Error checking if "Pikachu" exists in the database.')
    throw error
  }
  for (const record of (pokemon as any).data) {
    // In order to save time, we'll just use the embeddings we've already generated
    // for each Pokémon. If you want to generate them yourself, uncomment the
    // following line and comment out the line after it.
    // const embedding = await generateEmbedding(p.name);
    // await new Promise((r) => setTimeout(r, 500)); // Wait 500ms between requests;
    const { embedding, ...p } = record

    // Create the pokemon in the database
    const [pokemon] = await db.insert(pokemons).values(p).returning()

    await db
      .update(pokemons)
      .set({
        embedding,
      })
      .where(eq(pokemons.id, pokemon.id))

    console.log(`Added ${pokemon.number} ${pokemon.name}`)
  }

  // Uncomment the following lines if you want to generate the JSON file
  // fs.writeFileSync(
  //   path.join(__dirname, "./pokemon-with-embeddings.json"),
  //   JSON.stringify({ data }, null, 2),
  // );
  console.log('Pokédex seeded successfully!')
}
main()
  .then(async () => {
    process.exit(0)
  })
  .catch(async (e) => {
    console.error(e)

    process.exit(1)
  })

async function generateEmbedding(_input: string) {
  const input = _input.replace(/\n/g, ' ')
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-ada-002'),
    value: input,
  })
  return embedding
}
