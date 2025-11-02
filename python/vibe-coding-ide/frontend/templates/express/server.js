import express from 'express';
import morgan from 'morgan';

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for cross-origin requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'express', time: new Date().toISOString() });
});

app.get('/api/ping', (_req, res) => {
  res.json({ message: 'pong' });
});

// Simple in-memory todos
const todos = [];

app.get('/api/todos', (_req, res) => {
  res.json({ todos });
});

app.post('/api/todos', (req, res) => {
  const title = (req.body && req.body.title) || '';
  if (!title) return res.status(400).json({ error: 'title is required' });
  const todo = { id: String(Date.now()), title };
  todos.push(todo);
  res.status(201).json({ todo });
});

app.delete('/api/todos/:id', (req, res) => {
  const id = req.params.id;
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  const [deleted] = todos.splice(idx, 1);
  res.json({ deleted });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Express API listening on http://0.0.0.0:${port}`);
});
