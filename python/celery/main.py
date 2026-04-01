from __future__ import annotations

import json
from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field, ValidationError

from worker.celery import QUEUE_NAME
from worker.store import clear_jobs, create_job, get_job, list_recent_jobs, update_job
from worker.tasks import calculate_fibonacci, prime_factorize


class FibonacciParams(BaseModel):
    n: int = Field(ge=0, le=500)


class FactorizeParams(BaseModel):
    number: int = Field(ge=-1_000_000_000, le=1_000_000_000)


TASKS = [
    {
        "name": "calculate_fibonacci",
        "label": "Fibonacci",
        "description": "Calculate the Nth Fibonacci number.",
        "fields": [{"key": "n", "label": "N", "type": "number", "default": 35}],
    },
    {
        "name": "prime_factorize",
        "label": "Factorize",
        "description": "Find the prime factors of a number.",
        "fields": [{"key": "number", "label": "Number", "type": "number", "default": 123456789}],
    },
]

TASK_REGISTRY: dict[str, tuple] = {
    "calculate_fibonacci": (calculate_fibonacci, FibonacciParams),
    "prime_factorize": (prime_factorize, FactorizeParams),
}

templates = Jinja2Templates(directory=str(Path(__file__).parent / "templates"))

app = FastAPI(title="Celery + Vercel Queues + Redis")


class CreateJobRequest(BaseModel):
    task: str
    params: dict[str, Any] = Field(default_factory=dict)


@app.get("/")
def read_root(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={"tasks_json": json.dumps(TASKS)},
    )


@app.get("/api/health")
def health():
    return {"status": "ok", "queue": QUEUE_NAME, "tasks": list(TASK_REGISTRY)}


@app.get("/api/jobs")
def get_jobs():
    return list_recent_jobs()


@app.get("/api/jobs/{job_id}")
def get_job_status(job_id: str):
    job = get_job(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found.")
    return job


@app.delete("/api/jobs")
def delete_jobs():
    return {"cleared": clear_jobs()}


@app.post("/api/jobs", status_code=status.HTTP_201_CREATED)
def enqueue_job(body: CreateJobRequest):
    if body.task not in TASK_REGISTRY:
        raise HTTPException(status_code=400, detail=f"Unknown task: {body.task}")

    celery_task, params_model = TASK_REGISTRY[body.task]

    try:
        validated = params_model(**body.params)
    except ValidationError as exc:
        msg = exc.errors()[0].get("msg", "Invalid parameters")
        raise HTTPException(status_code=400, detail=msg) from exc

    params = validated.model_dump()
    job_id = uuid4().hex[:8]
    create_job(job_id, task=body.task, params=params)

    try:
        result = celery_task.apply_async(
            args=[job_id], kwargs=params, task_id=job_id, queue=QUEUE_NAME,
        )
    except Exception as exc:
        update_job(job_id, status="failed", result={"error": str(exc)})
        raise HTTPException(status_code=500, detail="Failed to enqueue task.") from exc

    update_job(job_id, message_id=str(result.id), queue_name=QUEUE_NAME)
    return {
        "id": job_id,
        "messageId": str(result.id),
        "queueName": QUEUE_NAME,
        "taskName": body.task,
    }
