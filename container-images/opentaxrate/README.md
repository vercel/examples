---
name: OpenTaxRate on Vercel
slug: opentaxrate-container
description: Run OpenTaxRate, an open-source API for US sales tax rates by street address, on Vercel Functions as a container image.
framework:
  - Other
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/container-images/opentaxrate
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/container-images/opentaxrate&project-name=opentaxrate&repository-name=opentaxrate&env=DATABASE_URL
publisher: Vercel
relatedTemplates:
  - container-images-demo
---

# OpenTaxRate on Vercel

Run [OpenTaxRate](https://github.com/equated-org/opentaxrate) on [Vercel Functions](https://vercel.com/docs/functions) as a [container image](https://vercel.com/docs/functions/container-images). OpenTaxRate is an MIT-licensed Hono API that returns the combined sales tax rate for a US street address, with the jurisdiction breakdown and the published source. It reads the states' own address ranges and tax boundaries from PostgreSQL with PostGIS.

This example contains no OpenTaxRate code. `Dockerfile.vercel` fetches OpenTaxRate at a pinned commit, compiles it, and runs the API on Node 22 behind `tini`, so `SIGTERM` reaches Node and instances stop in milliseconds. The API already listens on `$PORT` and reads its configuration from environment variables, so it needs no changes to run on Vercel.

> OpenTaxRate has no tagged release yet. This example pins commit `77f1d33`; change `OPENTAXRATE_COMMIT` in `Dockerfile.vercel` to upgrade.

## How to use

### 1. Create a database

Add a Postgres database from the [Vercel Marketplace](https://vercel.com/docs/marketplace-storage), which sets `DATABASE_URL` on your project:

```bash
vercel link
vercel install neon
```

OpenTaxRate's migrations run `CREATE EXTENSION postgis`, so use a provider and plan that allow the PostGIS extension.

### 2. Create the tables

Build the image once on your machine and run its `migrate` command against the same database:

```bash
docker build -f Dockerfile.vercel -t opentaxrate-on-vercel .
docker run --rm -e DATABASE_URL="postgres://..." opentaxrate-on-vercel migrate
```

### 3. Load tax data

Rate data is loaded outside Vercel Functions: a full load downloads about 5 GB and takes about 45 minutes. Load only the states you need from an OpenTaxRate checkout on your machine or in CI:

```bash
git clone https://github.com/equated-org/opentaxrate && cd opentaxrate
pnpm install
DATABASE_URL="postgres://..." pnpm refresh OH TX WA
```

See OpenTaxRate's [data maintenance guide](https://github.com/equated-org/opentaxrate/blob/main/docs/data.md) for snapshots and refresh options.

### 4. Deploy

Deploy with the button, or from this folder:

```bash
vercel deploy --prod
```

Then look up a rate:

```bash
curl https://<your-deployment>.vercel.app/health
curl -G https://<your-deployment>.vercel.app/v1/rate \
  --data-urlencode state=OH --data-urlencode "street=90 W Broad St" \
  --data-urlencode city=Columbus --data-urlencode zip=43215
```

The OpenAPI spec is at `/v1/openapi.json` and loaded states are listed at `/v1/coverage`.

## Environment variables

See [`.env.example`](./.env.example) and OpenTaxRate's [configuration guide](https://github.com/equated-org/opentaxrate/blob/main/docs/configuration.md) for every option.

| Variable | Required | Meaning |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL with PostGIS. Set by the Marketplace integration. |
| `OPENTAXRATE_MASTER_KEYS` | No | Keys for your own apps (`name=otr_master_...`), sent as `x-api-key` or `Authorization: Bearer`. Unknown keys get `401`. |
| `OPENTAXRATE_PUBLIC_LIMIT` | No | Per-IP limit for unkeyed lookups, such as `60/min`. |
| `OPENTAXRATE_CORS_ORIGINS` | No | Browser origins allowed to call the API. |
| `OPENTAXRATE_USER_AGENT` | No | Sent to the states' and geocoders' sites; include a contact. |
| `CENSUS_DISABLED`, `NOMINATIM_DISABLED` | No | Turn off the free public geocoders. |
| `PORT` | No | Defaults to 80 in the image, which is what Vercel expects. |

## Test locally

Requires Docker. The smoke test starts a PostGIS container, runs the image's migrations, loads a small synthetic Wyoming fixture (not real tax rates), turns the outside geocoders off, and checks the API. No real keys are used.

```bash
docker build -f Dockerfile.vercel -t opentaxrate-on-vercel .
./local-test/smoke-test.sh
```

Expected output:

```
PASS  health on default PORT 80 (200)
PASS  OpenAPI spec (200)
PASS  rejects an unknown API key (401)
PASS  coverage with master key (200)
PASS  coverage lists WY
PASS  rejects a lookup without a state (400)
PASS  rate by street address (200)
PASS  combined rate is 7%
PASS  matched on the street range
PASS  public (no key) rate lookup (200)
PASS  SIGTERM shutdown (exit 143, 176 ms)
All checks passed.
```

## Caveats

- **Data loads don't belong in a function.** Run `refresh` from your machine or CI, as above. The function only serves lookups.
- **Per-instance state.** Vercel runs many instances and the file system is not persistent. `OPENTAXRATE_PUBLIC_LIMIT` and `OPENTAXRATE_CACHE_HOURS` keep their counts in memory, per instance. Geocoder daily caps are stored in the database, so they hold across instances.
- **Public geocoders.** By default an address that the loaded data can't place may be sent to the free Census and Nominatim geocoders. Nominatim's policy allows at most 1 request a second and no systematic use, so set `NOMINATIM_DISABLED=true` or point `NOMINATIM_URL` at your own instance for a public API.
- **Accounts and billing.** OpenTaxRate's optional accounts (`BETTER_AUTH_*`, `RESEND_API_KEY`, `STRIPE_SECRET_KEY`) were not tested with this example.
- **Not tax advice.** OpenTaxRate returns the general rate at an address, not product taxability or exemptions. Check the `source` it returns.

## Learn more

- [Container images on Vercel Functions](https://vercel.com/docs/functions/container-images)
- [Storage on Vercel Marketplace](https://vercel.com/docs/marketplace-storage)
- [OpenTaxRate architecture](https://github.com/equated-org/opentaxrate/blob/main/docs/architecture.html)
