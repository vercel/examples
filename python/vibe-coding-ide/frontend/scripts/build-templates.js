#!/usr/bin/env node

/**
 * Build script to generate src/templates-data.json from the templates directory
 * This avoids Turbopack/Next dev server having to process the entire templates tree.
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const TEMPLATES_DIR = path.join(ROOT, 'templates')
const OUTPUT_FILE = path.join(ROOT, 'src', 'templates-data.json')

const TEMPLATE_METADATA = [
  {
    id: 'blank',
    label: 'Blank',
    description: 'Start from an empty project',
    directory: 'blank',
    defaultActiveFile: 'README.md',
    suggestions: [
      'Create a minimal Python API with FastAPI and run',
      'Add /health and /time endpoints with basic request logging and run',
      'Implement /text/wordcount that accepts JSON and returns counts and run',
    ],
  },
  {
    id: 'react_fastapi',
    label: 'Next.js + FastAPI',
    description: 'Decoupled frontend (Next.js) and backend (FastAPI)',
    directory: 'react-fastapi',
    defaultActiveFile: 'backend/main.py',
    suggestions: [
      'Add FastAPI /todos and a Next.js page to list/add todos; connect API and run',
      'Implement FastAPI /math/fibonacci?n=20 and display results in Next.js and run',
      'Add FastAPI logging, /health, /time; add a Next.js status page and run',
    ],
  },
  {
    id: 'fastapi',
    label: 'FastAPI',
    description: 'Python API with FastAPI + Uvicorn',
    directory: 'fastapi',
    defaultActiveFile: 'main.py',
    suggestions: [
      'Run this code.',
      'Add a FastAPI /todos API with in-memory CRUD (GET, POST, DELETE) and run',
      'Implement /math/fibonacci?n=20 that returns the sequence as JSON and run',
      'Add request logging middleware plus /health and /time endpoints and run',
    ],
  },
  {
    id: 'express',
    label: 'Express',
    description: 'Node.js API with Express',
    directory: 'express',
    defaultActiveFile: 'server.js',
    suggestions: [
      'Run this code.',
      'Add /todos API with in-memory CRUD (GET, POST, DELETE) and run',
      'Implement /math/fibonacci?n=20 that returns the sequence as JSON and run',
      'Add request logging middleware plus /health and /time endpoints and run',
    ],
  },
  {
    id: 'flask',
    label: 'Flask',
    description: 'Python API with Flask',
    directory: 'flask',
    defaultActiveFile: 'app.py',
    suggestions: [
      'Run this code.',
      'Add /todos API with in-memory CRUD (GET, POST, DELETE) and run',
      'Implement /math/fibonacci?n=20 that returns the sequence as JSON and run',
      'Add request logging middleware plus /health and /time endpoints and run',
    ],
  },
  {
    id: 'hono',
    label: 'Hono',
    description: 'TypeScript/JavaScript API with Hono',
    directory: 'hono',
    defaultActiveFile: 'server.ts',
    suggestions: [
      'Run this code.',
      'Add /todos API with in-memory CRUD (GET, POST, DELETE) and run',
      'Implement /math/fibonacci?n=20 that returns the sequence as JSON and run',
      'Add request logging middleware plus /health and /time endpoints and run',
    ],
  },
  {
    id: 'next',
    label: 'Next.js',
    description: 'React framework with server-side rendering',
    directory: 'next',
    defaultActiveFile: 'src/app/page.tsx',
    suggestions: [
      'Run this code.',
      'Add /api/todos route with in-memory CRUD (GET, POST, DELETE) and run',
      'Implement /api/math/fibonacci?n=20 returning JSON and render it on the page and run',
      'Add request logging plus /api/health and /api/time routes and run',
    ],
  },
  {
    id: 'next_stack',
    label: 'Next.js',
    description: 'Next.js frontend built to pair with a backend',
    directory: 'next_stack',
    defaultActiveFile: 'src/app/page.tsx',
  },
  {
    id: 'react',
    label: 'React (Vite)',
    description: 'React SPA powered by Vite + TypeScript',
    directory: 'react',
    defaultActiveFile: 'src/App.tsx',
    suggestions: [
      'Run this code.',
      'Add a simple todo list component with local state and run',
      'Fetch from a /api/health endpoint and render status and run',
    ],
  },
  {
    id: 'react_stack',
    label: 'React',
    description: 'React (Vite) frontend built to pair with a backend',
    directory: 'react_stack',
    defaultActiveFile: 'src/App.tsx',
  },
]

const BINARY_IMAGE_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.bmp',
]

function isBinaryImage(filename) {
  const ext = path.extname(filename).toLowerCase()
  return BINARY_IMAGE_EXTENSIONS.includes(ext)
}

function readDirRecursive(dir, baseDir = dir) {
  const files = {}

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/')

      if (entry.isDirectory()) {
        walk(fullPath)
      } else if (entry.isFile()) {
        // Skip metadata file if present
        if (entry.name === 'index.ts') continue

        if (isBinaryImage(entry.name)) {
          // For binary images, store as base64 data URL
          const buffer = fs.readFileSync(fullPath)
          const base64 = buffer.toString('base64')
          const ext = path.extname(entry.name).slice(1)
          files[relativePath] = `data:image/${ext};base64,${base64}`
        } else {
          // For text files, store as raw string
          files[relativePath] = fs.readFileSync(fullPath, 'utf-8')
        }
      }
    }
  }

  walk(dir)
  return files
}

function buildTemplates() {
  const templates = []

  for (const meta of TEMPLATE_METADATA) {
    const templateDir = path.join(TEMPLATES_DIR, meta.directory)

    if (!fs.existsSync(templateDir)) {
      console.warn(`Warning: Template directory not found: ${templateDir}`)
      continue
    }

    const files = readDirRecursive(templateDir)

    templates.push({
      id: meta.id,
      label: meta.label,
      description: meta.description,
      files,
      defaultActiveFile: meta.defaultActiveFile,
      suggestions: meta.suggestions,
    })
  }

  return templates
}

function ensureDirFor(filePath) {
  const dir = path.dirname(filePath)
  fs.mkdirSync(dir, { recursive: true })
}

// Main execution
try {
  console.log('Building templates...')
  const templates = buildTemplates()
  ensureDirFor(OUTPUT_FILE)
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(templates, null, 2))
  console.log(
    `✓ Generated ${path.relative(ROOT, OUTPUT_FILE)} with ${
      templates.length
    } templates`
  )
} catch (err) {
  console.error('Failed to build templates-data.json')
  console.error(err && err.stack ? err.stack : err)
  process.exitCode = 1
}
