import { randomUUID } from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest } from 'next/server'
import { serialize } from 'cookie'

export type Todo = {
  id: string
  title: string
  done?: boolean
}

/**
 * There's no real database in this example, we store the user
 * and its todos in cookies.
 */
class DB {
  async signup(
    data: { username: string; password: string },
    res: NextApiResponse
  ) {
    res.setHeader(
      'Set-Cookie',
      serialize('user', data.username, { httpOnly: true, path: '/' })
    )
    return data
  }

  async getUserFromReq(
    req: NextRequest | NextApiRequest
  ): Promise<{ username: string } | null> {
    const username =
      typeof req.cookies.get === 'function'
        ? req.cookies.get('user')?.value
        : (req.cookies as NextApiRequest['cookies'])['user']
    return username ? { username } : null
  }

  async getTodos(username: string, req: NextApiRequest): Promise<Todo[]> {
    const data = req.cookies['todos']
    const dataObj = data ? JSON.parse(data) : {}

    // Match that the todos belong to the user
    return dataObj?.username === username ? dataObj.todos : []
  }

  async setTodos(username: string, todos: Todo[], res: NextApiResponse) {
    res.setHeader(
      'Set-Cookie',
      serialize('todos', JSON.stringify({ username, todos }), {
        httpOnly: true,
        path: '/',
      })
    )
    return todos
  }

  async addTodo(
    username: string,
    data: { title: string },
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const todos = await this.getTodos(username, req)

    todos.push({ ...data, id: randomUUID() })

    return this.setTodos(username, todos, res)
  }

  async updateTodo(
    username: string,
    id: string,
    data: { title?: string; done?: boolean },
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const todos = await this.getTodos(username, req)
    const index = todos.findIndex((todo) => todo.id === id)

    if (index === -1) return todos

    todos[index] = { ...todos[index], ...data }

    return this.setTodos(username, todos, res)
  }

  async removeTodo(
    username: string,
    id: string,
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const todos = await this.getTodos(username, req)
    return this.setTodos(
      username,
      todos.filter((todo) => todo.id !== id),
      res
    )
  }
}

const db = new DB()

export default db
