import { sql } from '@vercel/postgres'
import { db } from '@/lib/drizzle'
import { UsersTable, User, NewUser } from './drizzle'

const newUsers: NewUser[] = [
  {
    name: 'Guillermo Rauch',
    email: 'rauchg@vercel.com',
    image:
      'https://images.ctfassets.net/e5382hct74si/2P1iOve0LZJRZWUzfXpi9r/9d4d27765764fb1ad7379d7cbe5f1043/ucxb4lHy_400x400.jpg',
  },
  {
    name: 'Lee Robinson',
    email: 'lee@vercel.com',
    image:
      'https://images.ctfassets.net/e5382hct74si/4BtM41PDNrx4z1ml643tdc/7aa88bdde8b5b7809174ea5b764c80fa/adWRdqQ6_400x400.jpg',
  },
  {
    name: 'Steven Tey',
    email: 'stey@vercel.com',
    image:
      'https://images.ctfassets.net/e5382hct74si/4QEuVLNyZUg5X6X4cW4pVH/eb7cd219e21b29ae976277871cd5ca4b/profile.jpg',
  },
]

export async function seed() {
  // Create table with raw SQL
  const createTable = await sql.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        image VARCHAR(255),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
  `)
  console.log(`Created "users" table`)

  const insertedUsers: User[] = await db
    .insert(UsersTable)
    .values(newUsers)
    .returning()
  console.log(`Seeded ${insertedUsers.length} users`)

  return {
    createTable,
    insertedUsers,
  }
}
