---
name: DuckDB on Vercel
slug: duckdb-container
description: Serve a read-only SQL API over a CSV, Parquet or JSON file with DuckDB 2.0, running on Vercel Functions as a container image.
framework:
  - Other
type:
  - Starter
css:
  - None
githubUrl: https://github.com/vercel/examples/tree/main/container-images/duckdb
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/container-images/duckdb&project-name=duckdb-on-vercel&repository-name=duckdb-on-vercel&env=DATA_URL,API_KEY
publisher: Vercel
relatedTemplates:
  - container-images-demo
---

# DuckDB on Vercel

Run [DuckDB](https://github.com/duckdb/duckdb) 2.0, the open-source in-process analytical database, on [Vercel Functions](https://vercel.com/docs/functions) as a [container image](https://vercel.com/docs/functions/container-images). The function loads one CSV, Parquet or JSON file from a URL (for example a public [Vercel Blob](https://vercel.com/docs/vercel-blob) file) into an in-memory DuckDB table at startup and answers read-only SQL queries over HTTP.

`Dockerfile.vercel` installs DuckDB `2.0.0` from PyPI at a pinned version, bakes the `httpfs` extension into the image so cold starts never download it, and runs a small FastAPI app (`app.py`) on `0.0.0.0:$PORT`.

## How it works

- At startup, `app.py` reads `DATA_URL` into a table named `data` (`read_parquet`, `read_json_auto` or `read_csv_auto`, picked by file extension).
- It then sets `enable_external_access = false` and `lock_configuration = true`, so queries can only see that in-memory table: no files, no network, and the setting cannot be turned back on.
- `POST /query` accepts exactly one `SELECT` statement and returns at most `MAX_ROWS` rows.

## How to use

Deploy with the button, or from this folder:

```bash
vercel env add DATA_URL
vercel env add API_KEY
vercel deploy --prod
```

Then query it:

```bash
curl https://<your-deployment>.vercel.app/health
curl -H "Authorization: Bearer <api-key>" https://<your-deployment>.vercel.app/schema
curl -H "Authorization: Bearer <api-key>" -H "content-type: application/json" \
  -d '{"sql":"SELECT region, sum(units * price) AS revenue FROM data GROUP BY region"}' \
  https://<your-deployment>.vercel.app/query
```

| Endpoint | Auth | Returns |
| --- | --- | --- |
| `GET /health` | No | DuckDB version and loaded row count |
| `GET /schema` | Yes | Columns and types of table `data` |
| `POST /query` | Yes | `{ "columns", "rows", "truncated" }` for one `SELECT` |

## Environment variables

See [`.env.example`](./.env.example).

| Variable | Required | Meaning |
| --- | --- | --- |
| `DATA_URL` | Yes | HTTPS URL of the CSV, Parquet or JSON file to load. A public Vercel Blob URL works. |
| `API_KEY` | Yes | Key clients send as `Authorization: Bearer <key>` to `/schema` and `/query`. |
| `MAX_ROWS` | No | Maximum rows returned per query. Defaults to `1000`. |
| `PORT` | No | Defaults to 80 in the image, which is what Vercel expects. |

## Test locally

Requires Docker and Python 3. The smoke test runs the image against a fake object store that serves a small CSV, so no real data or keys are used.

```bash
docker build -f Dockerfile.vercel -t duckdb-on-vercel .
./local-test/smoke-test.sh
```

Expected output (the mock also prints a `STORAGE ...` line for each request it receives):

```
PASS  health (200)
PASS  health reports 6 loaded rows
PASS  health reports DuckDB 2.0.0
PASS  rejects missing API key (401)
PASS  rejects wrong API key (401)
PASS  schema (200)
PASS  schema lists columns
PASS  aggregate query (200)
PASS  aggregate result
PASS  rejects non-SELECT statements (400)
PASS  blocks network reads (400)
PASS  network read blocked by configuration
PASS  blocks local file reads (400)
PASS  caps rows at MAX_ROWS (200)
PASS  result marked truncated
PASS  listens on default port 80 (200)
PASS  SIGTERM exits cleanly (code 0 in 0s)
All checks passed.
```

## Caveats

- **Read-only, per instance.** Container functions are stateless and Vercel scales to many instances. Each instance loads `DATA_URL` on cold start and keeps its own in-memory copy. Writes are rejected; to change the data, replace the file and redeploy. Store anything that must persist in a backing service.
- **Dataset size.** The whole file is loaded into memory on every cold start, so keep it within the function's memory and keep startup fast. Larger datasets need a different approach, such as querying remote Parquet files directly, which this example does not cover.
- **Query cost.** There is no per-query timeout. Requests are bounded by the function's maximum duration.
- **DuckDB Quack server.** DuckDB 2.0's client-server protocol keeps a single writable database on the server. That needs durable local storage and one long-lived process, which this stateless setup does not provide.

## Learn more

- [Container images on Vercel Functions](https://vercel.com/docs/functions/container-images)
- [Vercel Blob public storage](https://vercel.com/docs/vercel-blob/public-storage)
- [DuckDB documentation](https://duckdb.org/docs/)
