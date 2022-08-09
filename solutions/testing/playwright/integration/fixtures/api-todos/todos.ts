import { randomUUID } from 'crypto'

export const todosBody = {
  todos: [
    { id: randomUUID(), title: 'Make a cup of tea' },
    { id: randomUUID(), title: 'Go out and exercise' },
    { id: randomUUID(), title: 'Continue writing my next blog post' },
  ],
}
