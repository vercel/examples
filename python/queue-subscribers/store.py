import asyncio
import json
import logging
import os
import sqlite3
import time
from contextlib import contextmanager
from pathlib import Path
from typing import Any, Iterator

from vercel.cache import AsyncRuntimeCache

logger = logging.getLogger("queue-subscribers")
logger.setLevel(logging.INFO)

RESULT_TTL_SECONDS = 3600
RESULT_TAGS = ["queue-task-results"]
LOCAL_DATABASE_PATH = Path(__file__).with_name(".queue-results.sqlite3")


class ResultStore:
    def __init__(self) -> None:
        self._runtime_cache = AsyncRuntimeCache(namespace="queue-subscribers")
        self._use_runtime_cache = bool(
            os.getenv("VERCEL")
            and os.getenv("VERCEL_ENV") != "development"
        )
        self._backend = "runtime-cache" if self._use_runtime_cache else "sqlite"
        logger.info("Result store initialized backend=%s", self._backend)

    async def set(self, task_id: str, value: dict[str, Any]) -> None:
        logger.info(
            "Storing task task_id=%s status=%s backend=%s",
            task_id,
            value.get("status"),
            self._backend,
        )
        try:
            if self._use_runtime_cache:
                await self._runtime_cache.set(
                    task_id,
                    value,
                    {"ttl": RESULT_TTL_SECONDS, "tags": RESULT_TAGS},
                )
                return

            await asyncio.to_thread(self._set_local, task_id, value)
        except Exception:
            logger.exception(
                "Failed to store task task_id=%s backend=%s local_path=%s",
                task_id,
                self._backend,
                LOCAL_DATABASE_PATH,
            )
            raise

    async def get(self, task_id: str) -> dict[str, Any] | None:
        try:
            if self._use_runtime_cache:
                return await self._runtime_cache.get(task_id)

            return await asyncio.to_thread(self._get_local, task_id)
        except Exception:
            logger.exception(
                "Failed to read task task_id=%s backend=%s local_path=%s",
                task_id,
                self._backend,
                LOCAL_DATABASE_PATH,
            )
            raise

    async def delete(self, task_id: str) -> None:
        try:
            if self._use_runtime_cache:
                await self._runtime_cache.delete(task_id)
                return

            await asyncio.to_thread(self._delete_local, task_id)
        except Exception:
            logger.exception(
                "Failed to delete task task_id=%s backend=%s local_path=%s",
                task_id,
                self._backend,
                LOCAL_DATABASE_PATH,
            )
            raise

    @contextmanager
    def _connect(self) -> Iterator[sqlite3.Connection]:
        connection = sqlite3.connect(LOCAL_DATABASE_PATH, timeout=5)
        try:
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS task_results (
                    task_id TEXT PRIMARY KEY,
                    value TEXT NOT NULL,
                    expires_at REAL NOT NULL
                )
                """
            )
            yield connection
            connection.commit()
        finally:
            connection.close()

    def _set_local(self, task_id: str, value: dict[str, Any]) -> None:
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO task_results (task_id, value, expires_at)
                VALUES (?, ?, ?)
                ON CONFLICT(task_id) DO UPDATE SET
                    value = excluded.value,
                    expires_at = excluded.expires_at
                """,
                (
                    task_id,
                    json.dumps(value),
                    time.time() + RESULT_TTL_SECONDS,
                ),
            )

    def _get_local(self, task_id: str) -> dict[str, Any] | None:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT value, expires_at FROM task_results WHERE task_id = ?",
                (task_id,),
            ).fetchone()
            if row is None:
                return None

            value, expires_at = row
            if expires_at <= time.time():
                connection.execute(
                    "DELETE FROM task_results WHERE task_id = ?",
                    (task_id,),
                )
                return None

            return json.loads(value)

    def _delete_local(self, task_id: str) -> None:
        with self._connect() as connection:
            connection.execute(
                "DELETE FROM task_results WHERE task_id = ?",
                (task_id,),
            )


result_store = ResultStore()
