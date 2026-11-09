# DuckDB SQL API: loads one CSV, Parquet or JSON file at startup and answers read-only SELECT queries over HTTP.
import os
import secrets
from contextlib import asynccontextmanager

import duckdb
import uvicorn
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel

DATA_URL = os.environ.get("DATA_URL", "")
API_KEY = os.environ.get("API_KEY", "")
MAX_ROWS = int(os.environ.get("MAX_ROWS", "1000"))
READERS = {".parquet": "read_parquet", ".json": "read_json_auto", ".jsonl": "read_json_auto", ".ndjson": "read_json_auto"}

db: duckdb.DuckDBPyConnection | None = None
rows = 0


def load(url: str) -> duckdb.DuckDBPyConnection:
    con = duckdb.connect(":memory:")
    con.execute("LOAD httpfs")
    path = url.split("?", 1)[0].lower()
    reader = next((r for ext, r in READERS.items() if path.endswith(ext)), "read_csv_auto")
    con.execute(f"CREATE TABLE data AS SELECT * FROM {reader}(?)", [url])
    # Queries can only see the in-memory table: no files, no network, and the setting cannot be turned back on.
    con.execute("SET enable_external_access = false")
    con.execute("SET lock_configuration = true")
    return con


@asynccontextmanager
async def lifespan(_: FastAPI):
    global db, rows
    if not DATA_URL:
        raise RuntimeError("DATA_URL is not set")
    db = load(DATA_URL)
    rows = db.execute("SELECT count(*) FROM data").fetchone()[0]
    print(f"loaded {rows} rows into table data", flush=True)
    yield
    db.close()


app = FastAPI(title="DuckDB on Vercel", lifespan=lifespan)


def authorize(authorization: str | None) -> None:
    if not API_KEY:
        raise HTTPException(503, "API_KEY is not configured")
    token = (authorization or "").removeprefix("Bearer ").strip()
    if not secrets.compare_digest(token.encode(), API_KEY.encode()):
        raise HTTPException(401, "invalid or missing API key")


class Query(BaseModel):
    sql: str


@app.get("/health")
def health():
    return {"status": "ok", "duckdb": duckdb.__version__, "table": "data", "rows": rows}


@app.get("/schema")
def schema(authorization: str | None = Header(None)):
    authorize(authorization)
    cols = db.cursor().execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'data'").fetchall()
    return {"table": "data", "columns": [{"name": n, "type": t} for n, t in cols]}


@app.post("/query")
def query(body: Query, authorization: str | None = Header(None)):
    authorize(authorization)
    try:
        statements = duckdb.extract_statements(body.sql)
    except duckdb.Error as e:
        raise HTTPException(400, str(e))
    if len(statements) != 1 or statements[0].type != duckdb.StatementType.SELECT:
        raise HTTPException(400, "only a single SELECT statement is allowed")
    try:
        cur = db.cursor().execute(body.sql)
        result = cur.fetchmany(MAX_ROWS + 1)
    except duckdb.Error as e:
        raise HTTPException(400, str(e))
    return {
        "columns": [d[0] for d in cur.description],
        "rows": [list(r) for r in result[:MAX_ROWS]],
        "truncated": len(result) > MAX_ROWS,
    }


if __name__ == "__main__":
    # 80 is Vercel's default container port. uvicorn drains requests on SIGTERM.
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "80")), timeout_graceful_shutdown=25)
