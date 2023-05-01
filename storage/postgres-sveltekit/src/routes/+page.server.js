import { createPool } from '@vercel/postgres'

export async function load() {
  const db = createPool()
  try {
    const startTime = Date.now()
    const { rows: users } = await db.query('SELECT * FROM users')
    const duration = Date.now() - startTime
    return {
      users: users,
      duration: duration,
    }
  } catch (error) {
    // handle the error here
    console.error('An error occurred while fetching users:', error)
    throw error // re-throw the error to propagate it up the call stack
  }
}
