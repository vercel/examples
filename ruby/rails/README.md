---
name: Todo
slug: rails-todo
description: A Ruby on Rails todo app with Neon Postgres and Geist styling, deployed on Vercel.
framework: Other
useCase: Starter
css: CSS
database: Neon
---

# Todo

A todo list built with Ruby on Rails and Neon Postgres, running on Vercel.

Add, edit, complete, and filter tasks in a Geist-styled interface with light and
dark themes. Each browser gets its own list, saved in Postgres. No account or
client-side JavaScript is required.

## How to Use

Use the deploy button or clone the example locally. Local development and database
migrations require Ruby **3.3.10**, Bundler **2.7.2**, and Node.js for the Vercel CLI.

### Deploy with Vercel

[Set up Neon](#set-up-neon), then deploy the example using
[Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fruby%2Frails&project-name=todo&repository-name=todo&env=DATABASE_URL%2CDATABASE_URL_UNPOOLED%2CSECRET_KEY_BASE%2CVERCEL_EXPERIMENTAL_BUILDPACK_RUBY%2CVERCEL_CLI_VERSION&envDefaults=%7B%22VERCEL_EXPERIMENTAL_BUILDPACK_RUBY%22%3A%221%22%2C%22VERCEL_CLI_VERSION%22%3A%22vercel%40latest%22%7D&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fruby%2Frails%23set-up-neon)

The button asks for your database URLs and Rails session secret, and pre-fills the
experimental Ruby build settings. Clone the repository it creates, then run these
commands from its root to initialize the database before using the app:

```bash
bundle install
VERCEL_EXPERIMENTAL_BUILDPACK_RUBY=1 npx vercel@latest link
npx vercel@latest env pull .env.production.local --environment production
ENV_FILE=.env.production.local RAILS_ENV=production bin/migrate
```

### Clone and Deploy

```bash
git clone https://github.com/vercel/examples.git
cd examples/ruby/rails
bundle install
VERCEL_EXPERIMENTAL_BUILDPACK_RUBY=1 npx vercel@latest link
```

Create or select a project named `todo`, then follow [Set up Neon](#set-up-neon).
Pull the development environment and start the app:

```bash
npx vercel@latest env pull .env.local --environment development
bin/setup
```

`bin/setup` runs migrations and starts Rails at <http://localhost:3000>.
For subsequent runs, use `bin/rails server`.

Migrate the preview database, then deploy:

```bash
npx vercel@latest env pull .env.preview.local --environment preview
ENV_FILE=.env.preview.local RAILS_ENV=production bin/migrate

VERCEL_EXPERIMENTAL_BUILDPACK_RUBY=1 npx vercel@latest deploy \
  --target preview \
  --build-env VERCEL_EXPERIMENTAL_BUILDPACK_RUBY=1 \
  --build-env VERCEL_CLI_VERSION=vercel@latest
```

For production, connect a separate Neon database and set the Production environment
variables, then replace `preview` with `production` in the commands above. When
importing the full examples repository, set **Root Directory** to `ruby/rails`.

## Set up Neon

1. In your Vercel team's dashboard, open **Storage → Create Database** and select
   [Neon](https://vercel.com/marketplace/neon). Choose a plan and a region near your
   Vercel Function region.
2. Open the database in Neon and click **Connect**. Select a database and branch.
   Copy the pooled connection string into `DATABASE_URL`, then turn off
   **Connection pooling** and copy the direct string into `DATABASE_URL_UNPOOLED`.
   Keep Neon's connection parameters, including `sslmode=require`.
3. For an existing Vercel project, use **Storage → your database → Connect Project**
   to add the connection variables automatically. Select **Development** and
   **Preview** for the local/CLI walkthrough. Use a separate database for
   **Production**. For the deploy button, enter the production connection strings
   when prompted.
4. Generate a session secret with `ruby -rsecurerandom -e 'puts SecureRandom.hex(64)'`.
   Add it as `SECRET_KEY_BASE` in the project's environment variables, or enter it
   in the deploy form. Keep it stable across deployments to preserve existing lists.
5. Run the migration command for your chosen environment under [How to Use](#how-to-use).
   Neon creates the database; `bin/migrate` creates the tables.

Leave automatic **Preview Branching** off for this walkthrough. If you enable it
later, run migrations against each deployment's injected connection strings.
See the [Neon integration guide](https://neon.com/docs/guides/vercel-managed-integration)
for more details.

Already have a Neon database? Use its pooled and direct URLs from **Connect**.
For local development without Vercel, copy [`.env.example`](./.env.example) to
`.env.local`, fill in the three values, and run `bin/setup`.

## How it works

Rails renders ERB views and handles ordinary HTML form submissions. The
[`Todo` model](./app/models/todo.rb) validates task titles, and the
[controller](./app/controllers/todos_controller.rb) scopes every action to a list
ID stored in an encrypted, HttpOnly session cookie. Clearing cookies or switching
browsers starts a new list.

Requests use Neon's pooled connection. [`bin/migrate`](./bin/migrate) uses the direct
connection for schema changes, so migrations run explicitly before deployments.

The Vercel Ruby buildpack installs gems, precompiles assets with Propshaft, and
starts Rails. Geist and Geist Mono are served locally from `app/assets/fonts`
under the included [SIL Open Font License](./app/assets/fonts/OFL.txt).

## Environment variables

All three are required — see [`.env.example`](./.env.example). Rails loads
`.env.local` automatically outside tests; use `ENV_FILE` to select another file.

| Variable                | Description                                                                   |
| ----------------------- | ----------------------------------------------------------------------------- |
| `DATABASE_URL`          | Pooled Neon connection for application requests; hostname includes `-pooler`. |
| `DATABASE_URL_UNPOOLED` | Direct connection to the same database and branch, used for migrations.       |
| `SECRET_KEY_BASE`       | Secret used to encrypt and sign browser sessions.                             |

## Project structure

```text
rails/
├── app/
│   ├── assets/            # Geist fonts and styles
│   ├── controllers/       # Task actions scoped to the current browser
│   ├── models/todo.rb     # Validation and ordering
│   └── views/             # Task list, edit form, and layout
├── bin/
│   ├── migrate            # Migrate using the direct Neon connection
│   └── setup              # Check dependencies, migrate, and start Rails
├── config/database.yml    # Application and test database connections
├── db/migrate/            # Database schema
├── test/                  # Model and integration tests
└── vercel.json            # Ruby framework preset
```

## Tests

Use a disposable local PostgreSQL database; tests clear its data.

```bash
RAILS_ENV=test TEST_DATABASE_URL=postgresql://localhost/todo_test bundle exec rails db:prepare
RAILS_ENV=test TEST_DATABASE_URL=postgresql://localhost/todo_test bundle exec rails test
```

## Note

The Ruby buildpack is **experimental**. CLI deployments need
`VERCEL_EXPERIMENTAL_BUILDPACK_RUBY=1` on both the local process and remote build,
as shown above. For Git deployments, set that variable and
`VERCEL_CLI_VERSION=vercel@latest` in your project's environment settings.
