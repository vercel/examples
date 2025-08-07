import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";

const app = new Hono();

interface User {
  id: string;
  name: string;
}

const USERS: User[] = [
  {
    id: "1",
    name: "John Doe",
  },
  {
    id: "2",
    name: "Jane Smith",
  },
];

const AUTH_COOKIE_NAME = "saas_microservices_authed_user";

app.get("/api/users/login", (c) => {
  const existingUser = getCookie(c, AUTH_COOKIE_NAME);
  if (!existingUser) {
    const user = USERS[Math.floor(Math.random() * USERS.length)];
    setCookie(c, AUTH_COOKIE_NAME, user.id);
  }
  return c.redirect("/");
});

app.get("/api/users/logout", (c) => {
  deleteCookie(c, AUTH_COOKIE_NAME);
  return c.redirect("/");
});

app.get("/api/users/user", (c) => {
  const existingUser = getCookie(c, AUTH_COOKIE_NAME);
  if (!existingUser) {
    return c.json({ error: "User not found" }, 404);
  }
  const user = USERS.find((user) => user.id === existingUser);
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }
  return c.json(user);
});

export default app;
