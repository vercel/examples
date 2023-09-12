'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { sql } from '@vercel/postgres'

export type User = {
  id: number
  username: string
  password: string
  created_at: Date
  updated_at: Date
}

const USER_ID_COOKIE = 'user_id'

export async function getUserId() {
  const cookieStore = cookies()
  const username = cookieStore.get(USER_ID_COOKIE)?.value
  return username ? Number(username) : undefined
}

function setUserToken(id: number) {
  const cookieStore = cookies()
  cookieStore.set(USER_ID_COOKIE, String(id))
}

export async function login(data: { username: string; password: string }) {
  const result =
    await sql`SELECT id FROM users WHERE username = ${data.username} AND password = ${data.password}`

  setUserToken(result.rows[0].id)
}

export async function signup(data: { username: string; password: string }) {
  const result = await sql<{
    id: number
  }>`INSERT INTO users (username, password) VALUES (${data.username}, ${data.password}) RETURNING id`

  setUserToken(result.rows[0].id)
}

export async function logout() {
  const cookieStore = cookies()
  cookieStore.delete(USER_ID_COOKIE)
  redirect('/login')
}
