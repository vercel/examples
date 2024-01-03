import { db, sql } from '@/lib/kysely'

export async function seed() {
  const createTable = await db.schema
    .createTable('users')
    .ifNotExists()
    .addColumn('id', 'serial', (cb) => cb.primaryKey())
    .addColumn('name', 'varchar(255)', (cb) => cb.notNull())
    .addColumn('email', 'varchar(255)', (cb) => cb.notNull().unique())
    .addColumn('image', 'varchar(255)')
    .addColumn('createdAt', sql`timestamp with time zone`, (cb) =>
      cb.defaultTo(sql`current_timestamp`)
    )
    .execute()
  console.log(`Created "users" table`)
  const addUsers = await db
    .insertInto('users')
    .values([
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
    ])
    .execute()
  console.log('Seeded database with 3 users')
  return {
    createTable,
    addUsers,
  }
}
