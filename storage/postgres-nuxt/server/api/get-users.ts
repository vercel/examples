import { createPool } from '@vercel/postgres'

export default defineEventHandler(async () => {
  const startTime = Date.now()
  const db = createPool()
  const { rows: users } = await db.query('SELECT * FROM users')
  const duration = Date.now() - startTime
  return {
    users: users,
    duration: duration,
  }
})
