# Agent Guidelines for cms-graphql-fragments

## Commands
- **Build**: `npm run build` (uses Next.js with Turbopack)
- **Dev**: `npm run dev` (development server with Turbopack)
- **Lint**: `npm run lint` (Biome linter)
- **Format**: `npm run format` (Biome formatter)
- **Sanity Studio**: `npm run sanity:dev` (start Sanity Studio development server)
- **Deploy GraphQL**: `npm run sanity:deploy` (deploy GraphQL API to Sanity)
- **Generate Types**: `npm run schema:generate` (generate GraphQL types from Sanity schema)
- **No test command configured** - check with user if tests are needed

## Code Style
- **Formatter**: Biome with 2-space indentation
- **Imports**: Auto-organized by Biome, use `@/*` for src imports
- **Types**: Strict TypeScript, explicit types for props/exports
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Component Files**: Use kebab-case for component filenames (e.g., `my-component.tsx`)
- **Components**: Function declarations with explicit return types when complex
- **Error Handling**: Use TypeScript strict mode, handle async errors properly

### Biome Configuration
- **Import Organization**: Automatically enabled on save/format
- **Domain Rules**: Next.js and React recommended rules enabled
- **Ignored Files**: `node_modules`, `.next`, `dist`, `build`, `.sanity`, `lib/generated`
- **VCS Integration**: Git integration enabled with ignore file support

## Framework Specifics
- Next.js 15 App Router with React 19
- Tailwind CSS for styling
- Use `next/image` for images, `next/font` for fonts
- Export metadata objects for SEO
- Use `className` prop for styling

## GraphQL & Data Fetching
- **Client**: URQL with `@urql/next/rsc` for React Server Components
- **Type Safety**: gql.tada with GraphQL introspection from `src/lib/generated/graphql-env`
- **Client Setup**: Use `createGraphQLClient()` from `@/lib/graphql`
- **Query Pattern**: 
  ```typescript
  import { registerUrql } from "@urql/next/rsc";
  import { createGraphQLClient, graphql } from "@/lib/graphql";
  
  const { getClient } = registerUrql(createGraphQLClient);
  
  const QUERY = graphql(`
    query QueryName($param: String!) {
      field
    }
  `);
  
  const { data, error } = await getClient().query(QUERY, { param: "value" });
  ```
- **Error Handling**: Always check for `error` object and provide user-friendly error UI
- **ISR**: Use `export const revalidate = 60` for Incremental Static Regeneration
- **Scalars**: DateTime, Date (string), JSON (TypedObject from Sanity)

### Schema Generation Workflow
1. **After Sanity schema changes**: Deploy GraphQL API with `npm run sanity:deploy`
2. **Update types**: Run `npm run schema:generate` to regenerate TypeScript types
3. **Generated files**: Types are created in `src/lib/generated/` (auto-ignored by Biome)
4. **Import types**: Use generated types from `@/lib/graphql` for type safety

## GraphQL Fragment Colocation

### Fragment Definition Rules
- **Server Components**: Define fragments directly in component files
- **Client Components**: Define fragments in separate `.ts` files to avoid client/server boundary issues
- **Fragment files**: Use `-fragment.ts` suffix (e.g., `nav-link-fragment.ts`)

### Client Component Pattern
When a component needs `"use client"` directive:

1. **Fragment Definition** (`component-fragment.ts`):
   ```typescript
   import { graphql } from "@/lib/graphql";
   
   export const componentFragment = graphql(`
     fragment ComponentName on Type {
       field1
       field2
     }
   `);
   ```

2. **Client Component** (`component.tsx`):
   ```typescript
   "use client";
   
   import { type FragmentOf } from "@/lib/graphql";
   import type { componentFragment } from "./component-fragment";
   
   interface Props {
     data: FragmentOf<typeof componentFragment>;
   }
   
   export function Component({ data }: Props) {
     // Client-side logic (hooks, event handlers, etc.)
   }
   ```

3. **Parent Server Component**:
   ```typescript
   import { componentFragment } from "./component-fragment";
   import { Component } from "./component";
   
   const parentFragment = graphql(`...`, [componentFragment]);
   ```

### Why This Pattern?
- **Prevents Runtime Errors**: Avoids "f.definitions is not iterable" errors
- **Maintains Colocation**: Fragments stay close to components that use them
- **Respects Boundaries**: Separates server-side GraphQL logic from client-side interactivity
- **Type Safety**: Components get proper TypeScript types via `FragmentOf<typeof {GraphQL Fragment}>`

## Sanity CMS Integration

### Available Schema Types
The project includes comprehensive Sanity schemas defined in `src/lib/schema.ts`:

- **Post**: Blog posts with title, slug, excerpt, content, publishedAt
- **Page**: Static pages with title, slug, excerpt, content, SEO settings, published status
- **Navigation**: Site navigation with title and navigation items (label, href, isExternal)
- **Footer**: Footer configuration with title, description, links, social links, copyright
- **SEO**: SEO settings object with metaTitle and metaDescription
- **Social Links**: Platform-specific social media links (Twitter, GitHub, LinkedIn, etc.)

### Content Management Workflow
1. **Development**: Use `npm run sanity:dev` to start Sanity Studio
2. **Schema Changes**: After modifying `src/lib/schema.ts`, deploy with `npm run sanity:deploy`
3. **Type Generation**: Run `npm run schema:generate` to update GraphQL types
4. **Content Creation**: Use Sanity Studio to create and manage content
5. **ISR**: Content changes trigger revalidation automatically (only available on deployed project)
