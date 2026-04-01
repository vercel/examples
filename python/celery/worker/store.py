from __future__ import annotations

import os
import time
from typing import Any

import redis
from pydantic import BaseModel

REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
RECENT_JOBS_LIMIT = int(os.getenv("RECENT_JOBS_LIMIT", "100"))

JOB_KEY = "job:{}"
JOBS_SET = "jobs"

r = redis.Redis.from_url(REDIS_URL, decode_responses=True)


class Job(BaseModel):
    id: str
    task: str
    params: dict[str, Any] = {}
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
    r.set(JOB_KEY.format(job_id), job.model_dump_json())
    r.zadd(JOBS_SET, {job_id: now})
    return job


def get_job(job_id: str) -> Job | None:
    raw = r.get(JOB_KEY.format(job_id))
    if not raw:
        return None
    return Job.model_validate_json(raw)


def list_recent_jobs() -> list[Job]:
    job_ids = r.zrevrange(JOBS_SET, 0, RECENT_JOBS_LIMIT - 1)
    if not job_ids:
        return []
    values = r.mget([JOB_KEY.format(jid) for jid in job_ids])
    return [Job.model_validate_json(v) for v in values if v is not None]


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
    r.set(JOB_KEY.format(job_id), updated.model_dump_json())
    return updated


def clear_jobs() -> int:
    job_ids = r.zrange(JOBS_SET, 0, -1)
    if job_ids:
        pipe = r.pipeline()
        for jid in job_ids:
            pipe.delete(JOB_KEY.format(jid))
        pipe.delete(JOBS_SET)
        pipe.execute()
    return len(job_ids)
