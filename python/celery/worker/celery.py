from __future__ import annotations

import os

from celery import Celery

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
    task_ignore_result=True,
    task_serializer="json",
)
