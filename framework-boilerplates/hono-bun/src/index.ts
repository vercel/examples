import { Hono } from "hono";

const app = new Hono();

const runtime = typeof globalThis.Bun !== "undefined" ? "bun" : "node";

const welcomeStrings = [
  `Hello from ${runtime}!`,
  "To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono",
];

app.get("/", (c) => {
  return c.text(welcomeStrings.join("\n\n"));
});

export default app;
