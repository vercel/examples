# supabase-nextjs example

This example shows how to insert and retrieve data from a Supabase (Postgres) database using Next.js. It uses the App Router and SSR patterns:

- Mutation logic lives in `app/action.ts` using Next.js Server Actions.
- Query logic lives in `app/queries.ts` and is called from server components.
- Supabase client configuration is under `lib/supabase/`.

To run this example locally you need a `.env.local` file with your Supabase project keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Add your Supabase API keys there and then start the dev server.

## Running this project locally

1. Install dependencies:

```bash
pnpm install
```

2. Create a `.env.local` file in the project root and add your Supabase keys (see above).

3. Start the development server:

```bash
pnpm dev
```

4. Open the app in your browser:

```text
http://localhost:3000
```

## Database schema

This example expects a `notes` table in your Supabase Postgres database. The table stores each note created from the UI:

| Column        | Type          | Description                         |
| ------------- | ------------- | ----------------------------------- |
| `id`          | `uuid`        | Primary key for the note            |
| `username`    | `text`        | Name/handle of the note author      |
| `title`       | `text`        | Short title for the note            |
| `description` | `text`        | Main content/body of the note       |
| `created_at`  | `timestamptz` | Timestamp when the note was created |

A possible SQL definition for this table is:

```sql
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  title text not null,
  description text,
  created_at timestamptz not null default now()
);
```

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/app-directory/supabase-nextjs&project-name=supabase-nextjs&repository-name=supabase-nextjs)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/app-directory/supabase-nextjs
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
