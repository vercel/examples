'use server'

import { db } from '@/drizzle/db'
import { SelectPokemon, pokemons } from '@/drizzle/schema'
import { openai } from '@/lib/openai'
import { desc, sql, cosineDistance, gt } from 'drizzle-orm'
import { embed } from 'ai'

export async function searchPokedex(
  query: string
): Promise<Array<Pick<SelectPokemon, 'id' | 'name'> & { similarity: number }>> {
  try {
    if (query.trim().length === 0) return []

    const embedding = await generateEmbedding(query)
    const vectorQuery = `[${embedding.join(',')}]`

    const similarity = sql<number>`1 - (${cosineDistance(
      pokemons.embedding,
      vectorQuery
    )})`

    const pokemon = await db
      .select({ id: pokemons.id, name: pokemons.name, similarity })
      .from(pokemons)
      .where(gt(similarity, 0.5))
      .orderBy((t) => desc(t.similarity))
      .limit(8)

    return pokemon
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function generateEmbedding(raw: string) {
  // OpenAI recommends replacing newlines with spaces for best results
  const input = raw.replace(/\n/g, ' ')
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-ada-002'),
    value: input,
  })
  return embedding
}
