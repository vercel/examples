'use server'

import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'

export type Todo = {
  id: number
  title: string
  done: boolean
  userId: number
  createdAt: number
  updatedAt: number
}

export async function updateTodo(id: number, data: { done: boolean }) {
  const result =
    await sql<Todo>`UPDATE todos SET done = ${data.done} WHERE id = ${id} RETURNING *;`

  revalidatePath('/')

  return result.rows[0]
}

export async function getTodos(userId: number): Promise<Todo[]> {
  const result = await sql<Todo>`SELECT * FROM todos WHERE userId = ${userId};`
  return result.rows
}

export async function removeTodo(id: number) {
  await sql`DELETE FROM todos WHERE id = ${id};`
  revalidatePath('/')
}

export async function addTodo(data: {
  userId: number
  title: string
}): Promise<Todo> {
  const result =
    await sql<Todo>`INSERT INTO todos (title, done, userId) VALUES (${data.title}, false, ${data.userId}) RETURNING *;`

  revalidatePath('/')

  return result.rows[0]
}
