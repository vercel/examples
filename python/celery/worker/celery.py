from __future__ import annotations

import os

from celery import Celery

QUEUE_NAME = os.getenv("CELERY_QUEUE_NAME", "jobs")

# Vercel worker services use the Vercel Queues Celery broker. Set
# CELERY_BROKER_URL explicitly if you want to run Celery against another broker.
app = Celery(
    "celery-demo-worker",
    broker=os.getenv("CELERY_BROKER_URL", "vercel://"),
)

app.conf.update(
    accept_content=["json"],
    result_backend=None,
    result_serializer="json",
    task_default_queue=QUEUE_NAME,
    task_ignore_result=True,
    task_serializer="json",
)
