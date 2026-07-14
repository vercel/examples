from __future__ import annotations

import os
import time
from typing import Any

from pydantic import BaseModel, Field
from vercel.cache import RuntimeCache

RECENT_JOBS_LIMIT = int(os.getenv("RECENT_JOBS_LIMIT", "100"))
JOB_TTL_SECONDS = int(os.getenv("JOB_TTL_SECONDS", str(24 * 60 * 60)))

JOB_KEY = "job:{}"
JOBS_INDEX_KEY = "jobs:index"
JOBS_TAG = "celery-jobs"

cache = RuntimeCache(namespace="celery-vercel")


def _cache_options(name: str) -> dict[str, Any]:
    return {
        "ttl": JOB_TTL_SECONDS,
        "tags": [JOBS_TAG],
        "name": name,
    }


def _get_job_ids() -> list[str]:
    value = cache.get(JOBS_INDEX_KEY)
    if not isinstance(value, list):
        return []
    return [job_id for job_id in value if isinstance(job_id, str)]


def _set_job(job: "Job") -> None:
    cache.set(
        JOB_KEY.format(job.id),
        job.model_dump(mode="json"),
        _cache_options(f"Celery job {job.id}"),
    )


class Job(BaseModel):
    id: str
    task: str
    params: dict[str, Any] = Field(default_factory=dict)
    status: str = "queued"
    created_at: float | None = None
    started_at: float | None = None
    completed_at: float | None = None
    result: dict[str, Any] | None = None
    progress: dict[str, Any] | None = None
    message_id: str = ""
    queue_name: str = ""


def create_job(job_id: str, *, task: str, params: dict[str, Any]) -> Job:
    now = time.time()
    job = Job(id=job_id, task=task, params=params, created_at=now)
    _set_job(job)

    job_ids = [existing_id for existing_id in _get_job_ids() if existing_id != job_id]
    cache.set(
        JOBS_INDEX_KEY,
        [job_id, *job_ids][:RECENT_JOBS_LIMIT],
        _cache_options("Recent Celery jobs"),
    )
    return job


def get_job(job_id: str) -> Job | None:
    value = cache.get(JOB_KEY.format(job_id))
    if not isinstance(value, dict):
        return None
    return Job.model_validate(value)


def list_recent_jobs() -> list[Job]:
    jobs = (get_job(job_id) for job_id in _get_job_ids()[:RECENT_JOBS_LIMIT])
    return [job for job in jobs if job is not None]


def update_job(job_id: str, **updates: Any) -> Job | None:
    job = get_job(job_id)
    if job is None:
        return None

    now = time.time()
    if updates.get("status") == "running" and job.started_at is None:
        updates.setdefault("started_at", now)
    if updates.get("status") in {"completed", "failed"}:
        updates.setdefault("completed_at", now)

    updated = job.model_copy(update=updates)
    _set_job(updated)
    return updated


def clear_jobs() -> int:
    job_ids = _get_job_ids()
    cache.expire_tag(JOBS_TAG)
    return len(job_ids)
