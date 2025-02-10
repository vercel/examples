import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export async function seed() {
  // Create table with raw SQL
  const createTable = await sql`
      CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        image VARCHAR(255),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
  `
  console.log(`Created "profiles" table`)

  const profiles = await Promise.all([
    sql`
          INSERT INTO profiles (name, email, image)
          VALUES ('Guillermo Rauch', 'rauchg@vercel.com', 'https://images.ctfassets.net/e5382hct74si/2P1iOve0LZJRZWUzfXpi9r/9d4d27765764fb1ad7379d7cbe5f1043/ucxb4lHy_400x400.jpg')
          ON CONFLICT (email) DO NOTHING;
      `,
    sql`
          INSERT INTO profiles (name, email, image)
          VALUES ('Lee Robinson', 'lee@vercel.com', 'https://images.ctfassets.net/e5382hct74si/4BtM41PDNrx4z1ml643tdc/7aa88bdde8b5b7809174ea5b764c80fa/adWRdqQ6_400x400.jpg')
          ON CONFLICT (email) DO NOTHING;
      `,
    sql`
          INSERT INTO profiles (name, email, image)
          VALUES ('Steven Tey', 'stey@vercel.com', 'https://images.ctfassets.net/e5382hct74si/4QEuVLNyZUg5X6X4cW4pVH/eb7cd219e21b29ae976277871cd5ca4b/profile.jpg')
          ON CONFLICT (email) DO NOTHING;
      `,
  ])
  console.log(`Seeded ${profiles.length} users`)

  return {
    createTable,
    insertedUsers: profiles,
  }
}
