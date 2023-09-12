'use server'

import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'

export type Todo = {
  id: number
  title: string
  done: boolean
  user_id: number
  created_at: Date
  updated_at: Date
}

export async function updateTodo(id: number, data: { done: boolean }) {
  const result =
    await sql<Todo>`UPDATE todos SET done = ${data.done} WHERE id = ${id} RETURNING *;`

  revalidatePath('/')

  return result.rows[0]
}

export async function getTodos(user_id: number): Promise<Todo[]> {
  const result =
    await sql<Todo>`SELECT * FROM todos WHERE user_id = ${user_id} ORDER BY created_at DESC;`
  return result.rows
}

export async function removeTodo(id: number) {
  await sql`DELETE FROM todos WHERE id = ${id};`
  revalidatePath('/')
}

export async function addTodo(data: {
  user_id: number
  title: string
}): Promise<Todo> {
  const result =
    await sql<Todo>`INSERT INTO todos (title, done, user_id) VALUES (${data.title}, false, ${data.user_id}) RETURNING *;`

  revalidatePath('/')

  return result.rows[0]
}
