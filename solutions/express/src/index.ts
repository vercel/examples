import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.dirname(__filename);

// Serve static files from the public directory
app.use(express.static(path.join(rootDir, '..', 'public')));

// Home route - HTML
app.get('/', (req, res) => {
    res.type('html').send(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <title>Express on Vercel</title>
          <link rel="stylesheet" href="/style.css" />
        </head>
        <body>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/api-data">API Data</a>
            <a href="/healthz">Health</a>
          </nav>
          <h1>Welcome to Express on Vercel 🚀</h1>
          <p>This is a minimal example without a database or forms.</p>
          <img src="/images/logo.png" alt="Logo" width="120" />
        </body>
      </html>
    `);
});


app.get('/about', function (req: Request, res: Response) {
    res.sendFile(path.join(rootDir, '..', 'components', 'about.htm'));
});

// Example API endpoint - JSON
app.get('/api-data', (req, res) => {
    res.json({
        message: 'Here is some sample API data',
        items: ['apple', 'banana', 'cherry']
    });
});

// Health check
app.get('/healthz', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
