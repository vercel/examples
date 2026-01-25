import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const templates = [
  {
    name: 'Next.js App',
    description: 'Full-stack React application with App Router, TypeScript, and Tailwind CSS',
    category: 'framework',
    framework: 'nextjs',
    prompt: 'Create a Next.js 14 application with App Router, TypeScript, Tailwind CSS, and a modern dashboard layout',
    isPublic: true,
  },
  {
    name: 'React SPA',
    description: 'Single page application with React, Vite, and React Router',
    category: 'framework',
    framework: 'react',
    prompt: 'Create a React single page application with Vite, React Router, TypeScript, and Tailwind CSS',
    isPublic: true,
  },
  {
    name: 'Vue.js App',
    description: 'Modern Vue 3 application with Composition API and Pinia',
    category: 'framework',
    framework: 'vue',
    prompt: 'Create a Vue 3 application with Vite, Vue Router, Pinia, TypeScript, and Tailwind CSS',
    isPublic: true,
  },
  {
    name: 'Express API',
    description: 'REST API with Express.js, TypeScript, and OpenAPI documentation',
    category: 'backend',
    framework: 'express',
    prompt: 'Create a REST API server with Express.js, TypeScript, Zod validation, and OpenAPI/Swagger documentation',
    isPublic: true,
  },
  {
    name: 'FastAPI Server',
    description: 'Python REST API with FastAPI, Pydantic, and automatic docs',
    category: 'backend',
    framework: 'python',
    prompt: 'Create a FastAPI server with Pydantic models, SQLAlchemy ORM, and automatic OpenAPI documentation',
    isPublic: true,
  },
  {
    name: 'Full-Stack CRUD',
    description: 'Complete CRUD application with database, API, and frontend',
    category: 'fullstack',
    framework: 'nextjs',
    prompt: 'Create a full-stack CRUD application with Next.js, Prisma, SQLite, and a complete admin dashboard',
    isPublic: true,
  },
  {
    name: 'E-commerce Store',
    description: 'Online store with product catalog, cart, and checkout',
    category: 'fullstack',
    framework: 'nextjs',
    prompt: 'Create an e-commerce website with Next.js, product listings, shopping cart, and checkout flow',
    isPublic: true,
  },
  {
    name: 'AI Chatbot',
    description: 'AI-powered chatbot with streaming responses',
    category: 'ai',
    framework: 'nextjs',
    prompt: 'Create an AI chatbot application with Next.js, Vercel AI SDK, and a beautiful chat interface with streaming',
    isPublic: true,
  },
  {
    name: 'Landing Page',
    description: 'Modern marketing landing page with animations',
    category: 'marketing',
    framework: 'nextjs',
    prompt: 'Create a modern landing page with Next.js, Tailwind CSS, Framer Motion animations, and a contact form',
    isPublic: true,
  },
  {
    name: 'Blog Platform',
    description: 'Content management system with MDX support',
    category: 'fullstack',
    framework: 'nextjs',
    prompt: 'Create a blog platform with Next.js, MDX support, categories, tags, and search functionality',
    isPublic: true,
  },
  {
    name: 'Dashboard Template',
    description: 'Admin dashboard with charts and data tables',
    category: 'ui',
    framework: 'react',
    prompt: 'Create an admin dashboard with React, Recharts, data tables, and a sidebar navigation',
    isPublic: true,
  },
  {
    name: 'CLI Tool',
    description: 'Command-line application with Node.js',
    category: 'tools',
    framework: 'nodejs',
    prompt: 'Create a Node.js CLI tool with Commander.js, interactive prompts, and colorful output',
    isPublic: true,
  },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Seed templates
  for (const template of templates) {
    await prisma.template.upsert({
      where: { id: template.name.toLowerCase().replace(/\s+/g, '-') },
      update: template,
      create: {
        id: template.name.toLowerCase().replace(/\s+/g, '-'),
        ...template,
      },
    })
  }

  console.log(`✅ Seeded ${templates.length} templates`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
