import { randomUUID } from 'crypto'

type Todo = {
  id: string
  title: string
  done?: boolean
}

const todos: Todo[] = [
  { id: randomUUID(), title: 'Make a cup of tea' },
  { id: randomUUID(), title: 'Go out and exercise' },
  { id: randomUUID(), title: 'Continue writing my next blog post' },
]

export const todosBody = { todos }
