from __future__ import annotations

import os
from typing import Any

from vercel.cache import AsyncRuntimeCache


# TTL in seconds for cached run payloads
_TTL_SECONDS: int = int(os.getenv("RUN_STORE_TTL_SECONDS", "900"))
_NAMESPACE = os.getenv("RUN_STORE_NAMESPACE", "ide-agent-runs")


cache = AsyncRuntimeCache(namespace=_NAMESPACE)


def _cache_key(run_id: str) -> str:
    return f"run:{run_id}"


async def set_run_payload(run_id: str, payload: dict[str, Any]) -> None:
    """Store the base payload for a run id using Vercel Runtime Cache."""
    await cache.set(
        _cache_key(run_id),
        dict(payload),
        {"ttl": _TTL_SECONDS, "tags": [f"run:{run_id}"]},
    )


async def get_run_payload(run_id: str) -> dict[str, Any] | None:
    """Fetch the stored payload for a run id."""
    val = await cache.get(_cache_key(run_id))
    return dict(val) if isinstance(val, dict) else None


async def update_run_project(run_id: str, project: dict[str, str]) -> None:
    """Update only the project map for the stored run payload if present."""
    base = await cache.get(_cache_key(run_id))
    if isinstance(base, dict):
        updated = dict(base)
        updated["project"] = dict(project)
        await cache.set(
            _cache_key(run_id),
            updated,
            {"ttl": _TTL_SECONDS, "tags": [f"run:{run_id}"]},
        )


# Per-user active sandbox mappings (name -> sandbox_id)

def _user_sbx_key(user_id: str) -> str:
    return f"user:{user_id}:sandboxes"


async def get_user_sandboxes(user_id: str) -> dict[str, str]:
    val = await cache.get(_user_sbx_key(user_id))
    return dict(val) if isinstance(val, dict) else {}


async def upsert_user_sandbox(user_id: str, name: str, sandbox_id: str) -> None:
    cur = await get_user_sandboxes(user_id)
    cur[name] = sandbox_id
    await cache.set(_user_sbx_key(user_id), cur, {"ttl": _TTL_SECONDS})


async def remove_user_sandbox(user_id: str, name: str) -> None:
    cur = await get_user_sandboxes(user_id)
    if name in cur:
        cur.pop(name, None)
        await cache.set(_user_sbx_key(user_id), cur, {"ttl": _TTL_SECONDS})


# Per-user-per-project sandbox mappings (name -> sandbox_id)

def _user_project_sbx_key(user_id: str, project_id: str) -> str:
    return f"user:{user_id}:project:{project_id}:sandboxes"


async def get_user_project_sandboxes(user_id: str, project_id: str) -> dict[str, str]:
    val = await cache.get(_user_project_sbx_key(user_id, project_id))
    return dict(val) if isinstance(val, dict) else {}


async def upsert_user_project_sandbox(user_id: str, project_id: str, name: str, sandbox_id: str) -> None:
    cur = await get_user_project_sandboxes(user_id, project_id)
    cur[name] = sandbox_id
    await cache.set(_user_project_sbx_key(user_id, project_id), cur, {"ttl": _TTL_SECONDS})


async def remove_user_project_sandbox(user_id: str, project_id: str, name: str) -> None:
    cur = await get_user_project_sandboxes(user_id, project_id)
    if name in cur:
        cur.pop(name, None)
        await cache.set(_user_project_sbx_key(user_id, project_id), cur, {"ttl": _TTL_SECONDS})
