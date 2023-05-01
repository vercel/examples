import prisma from '../lib/prisma'
import { type Pokemon } from '@prisma/client'
import fs from 'fs'
import { openai } from '../lib/openai'
import path from 'path'
import pokemon from './pokemon-with-embeddings.json'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('process.env.OPENAI_API_KEY is not defined. Please set it.')
}

if (!process.env.POSTGRES_URL) {
  throw new Error('process.env.POSTGRES_URL is not defined. Please set it.')
}

async function main() {
  try {
    const pika = await prisma.pokemon.findFirst({
      where: {
        name: 'Pikachu',
      },
    })
    if (pika) {
      console.log('Pokédex already seeded!')
      return
    }
  } catch (error) {
    console.error('Error checking if "Pikachu" exists in the database.')
    throw error
  }
  for (const record of (pokemon as any).data as any[]) {
    const p = await getPokemonFromRecord(record)
    // In order to save time, we'll just use the embeddings we've already generated
    // for each Pokémon. If you want to generate them yourself, uncomment the
    // following line and comment out the line after it.
    // const embedding = await generateEmbedding(p.name);
    // await new Promise((r) => setTimeout(r, 500)); // Wait 500ms between requests
    // data.push({ ...p, embedding });
    const embedding = record.embedding

    // Create the pokemon in the database
    const pokemon = await prisma.pokemon.create({
      data: p,
    })

    // Add the embedding
    await prisma.$executeRaw`
        UPDATE pokemon
        SET embedding = ${embedding}::vector
        WHERE id = ${pokemon.id}
    `

    console.log(`Added ${p.number} ${p.name}`)
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
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

function getPokemonFromRecord(record: any): Omit<Pokemon, 'id' | 'embedding'> {
  return {
    number: parseInt(record['#']),
    name: record['Name'],
    type1: record['Type 1'],
    type2: record['Type 2'] || null,
    total: parseInt(record['Total']),
    hp: parseInt(record['HP']),
    attack: parseInt(record['Attack']),
    defense: parseInt(record['Defense']),
    spAtk: parseInt(record['Sp. Atk']),
    spDef: parseInt(record['Sp. Def']),
    speed: parseInt(record['Speed']),
    generation: parseInt(record['Generation']),
    legendary: record['Legendary'] === 'True',
  } satisfies Omit<Pokemon, 'id' | 'embedding'>
}

async function generateEmbedding(_input: string) {
  const input = _input.replace(/\n/g, ' ')
  const embeddingResponse = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input,
  })

  const embeddingData = await embeddingResponse.json()
  console.log(embeddingData)
  const [{ embedding }] = (embeddingData as any).data
  return embedding
}
