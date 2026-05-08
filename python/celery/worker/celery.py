from __future__ import annotations

import os

from celery import Celery

QUEUE_NAME = os.getenv("CELERY_QUEUE_NAME", "jobs")

# On Vercel and in `vercel dev`, worker services default CELERY_BROKER_URL to
# `vercel://`. When you run this project outside the Vercel runtime you can
# point it at Redis instead.
app = Celery(
    "celery-demo-worker",
    broker=os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0"),
)

app.conf.update(
    accept_content=["json"],
    result_backend=None,
    result_serializer="json",
    task_default_queue=QUEUE_NAME,
    task_ignore_result=True,
    task_serializer="json",
)
