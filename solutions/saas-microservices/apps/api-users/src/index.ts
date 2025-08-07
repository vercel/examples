import { Hono } from 'hono'

const app = new Hono()

interface User {
  id: string;
  name: string;
}

const USERS = [
  {
    id: '1',
    name: 'John Doe'
  },
  {
    id: '2',
    name: 'Jane Smith'
  }
];

app.get('/api/users/user', (c) => {
  return c.json(USERS[Math.floor(Math.random() * USERS.length)]);
})

export default app;