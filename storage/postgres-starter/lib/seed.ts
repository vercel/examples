import { sql } from '@vercel/postgres'

export async function seed() {
  const createTable = await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      image VARCHAR(255),
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    `

  console.log(`Created "users" table`)

  const users = await Promise.all([
    sql`
          INSERT INTO users (name, email, image)
          VALUES ('Guillermo Rauch', 'rauchg@vercel.com', 'https://pbs.twimg.com/profile_images/1576257734810312704/ucxb4lHy_400x400.jpg')
          ON CONFLICT (email) DO NOTHING;
      `,
    sql`
          INSERT INTO users (name, email, image)
          VALUES ('Lee Robinson', 'lee@vercel.com', 'https://pbs.twimg.com/profile_images/1587647097670467584/adWRdqQ6_400x400.jpg')
          ON CONFLICT (email) DO NOTHING;
      `,
    sql`
          INSERT INTO users (name, email, image)
          VALUES ('Steven Tey', 'stey@vercel.com', 'https://pbs.twimg.com/profile_images/1506792347840888834/dS-r50Je_400x400.jpg')
          ON CONFLICT (email) DO NOTHING;
      `,
  ])
  console.log(`Seeded ${users.length} users`)

  return {
    createTable,
    users,
  }
}
