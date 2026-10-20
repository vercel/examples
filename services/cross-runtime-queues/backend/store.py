import asyncio
import json
import os
import sqlite3
import time
from contextlib import contextmanager
from pathlib import Path
from typing import Any, Iterator

from vercel.cache import AsyncRuntimeCache

RESULT_TTL_SECONDS = 3600
LOCAL_DATABASE_PATH = Path(__file__).with_name(".queue-results.sqlite3")


class ResultStore:
    def __init__(self) -> None:
        self._runtime_cache = AsyncRuntimeCache(namespace="cross-runtime-queues")
        self._use_runtime_cache = bool(
            os.getenv("VERCEL") and os.getenv("VERCEL_ENV") != "development"
        )

    async def set(self, key: str, value: dict[str, Any]) -> None:
        if self._use_runtime_cache:
            await self._runtime_cache.set(
                key,
                value,
                {"ttl": RESULT_TTL_SECONDS},
            )
            return

        await asyncio.to_thread(self._set_local, key, value)

    async def get(self, key: str) -> dict[str, Any] | None:
        if self._use_runtime_cache:
            return await self._runtime_cache.get(key)

        return await asyncio.to_thread(self._get_local, key)

    async def delete(self, key: str) -> None:
        if self._use_runtime_cache:
            await self._runtime_cache.delete(key)
            return

        await asyncio.to_thread(self._delete_local, key)

    @contextmanager
    def _connect(self) -> Iterator[sqlite3.Connection]:
        connection = sqlite3.connect(LOCAL_DATABASE_PATH, timeout=5)
        try:
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS queue_results (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL,
                    expires_at REAL NOT NULL
                )
                """
            )
            yield connection
            connection.commit()
        finally:
            connection.close()

    def _set_local(self, key: str, value: dict[str, Any]) -> None:
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO queue_results (key, value, expires_at)
                VALUES (?, ?, ?)
                ON CONFLICT(key) DO UPDATE SET
                    value = excluded.value,
                    expires_at = excluded.expires_at
                """,
                (key, json.dumps(value), time.time() + RESULT_TTL_SECONDS),
            )

    def _get_local(self, key: str) -> dict[str, Any] | None:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT value, expires_at FROM queue_results WHERE key = ?",
                (key,),
            ).fetchone()
            if row is None:
                return None

            value, expires_at = row
            if expires_at <= time.time():
                connection.execute(
                    "DELETE FROM queue_results WHERE key = ?",
                    (key,),
                )
                return None

            return json.loads(value)

    def _delete_local(self, key: str) -> None:
        with self._connect() as connection:
            connection.execute("DELETE FROM queue_results WHERE key = ?", (key,))


result_store = ResultStore()
