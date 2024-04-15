import { sql } from '@vercel/postgres'

export async function fetchFilteredBooks(
  selectedAuthors: string[],
  query: string,
) {
  if (selectedAuthors.length > 0) {
    try {
      const books = await sql`
                SELECT
                    id,
                    isbn,
                    "title",
                    "author",
                    "year",
                    publisher,
                    image,
                    "createdAt"
                FROM books
                WHERE
                    "author" = ANY(${selectedAuthors}) AND (
                        isbn ILIKE ${`%${query}%`} OR
                        "title" ILIKE ${`%${query}%`} OR
                        "author" ILIKE ${`%${query}%`} OR
                        "year"::text ILIKE ${`%${query}%`} OR
                        publisher ILIKE ${`%${query}%`}
                    )
                ORDER BY "createdAt" DESC
            `
      return books.rows
    } catch (error) {
      console.error('Database Error:', error)
      throw new Error('Failed to fetch books.')
    }
  }

  try {
    const books = await sql`
            SELECT
                id,
                isbn,
                "title",
                "author",
                "year",
                publisher,
                "image",
                "createdAt"
            FROM books
            WHERE
                isbn ILIKE ${`%${query}%`} OR
                "title" ILIKE ${`%${query}%`} OR
                "author" ILIKE ${`%${query}%`} OR
                "year"::text ILIKE ${`%${query}%`} OR
                publisher ILIKE ${`%${query}%`}
            ORDER BY "createdAt" DESC
        `
    return books.rows
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch books.')
  }
}

export async function fetchBookById(id: string) {
  const data = await sql`SELECT * FROM books WHERE id = ${id}`
  console.log(data)
  return data.rows[0]
}
