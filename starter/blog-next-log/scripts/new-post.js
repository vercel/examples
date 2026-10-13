#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const slug = process.argv[2];

if (!slug) {
  console.error("Usage: npm run new-post <slug>");
  console.error('Example: npm run new-post "my-first-post"');
  process.exit(1);
}

// Read author from config
let author = "Author";
try {
  const configPath = path.join(process.cwd(), "next-log.config.ts");
  const configContent = fs.readFileSync(configPath, "utf8");
  const match = configContent.match(/name:\s*["']([^"']+)["']/);
  if (match) author = match[1];
} catch (e) {
  // fallback to default
}

const postsDir = path.join(process.cwd(), "posts", slug);

if (fs.existsSync(postsDir)) {
  console.error(`Error: Post "${slug}" already exists at posts/${slug}/`);
  process.exit(1);
}

fs.mkdirSync(postsDir, { recursive: true });

const today = new Date().toISOString().split("T")[0];

const content = `---
title: "${slug}"
date: ${today}
description: ""
author: "${author}"
category: ""
thumbnail: ""
published: false
---

Write your post here.
`;

const filePath = path.join(postsDir, "index.mdx");
fs.writeFileSync(filePath, content);

console.log(`Created: posts/${slug}/index.mdx`);
console.log(`Set published: true when ready to publish.`);
