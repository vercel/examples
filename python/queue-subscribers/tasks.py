from typing import Any

from vercel.cache import AsyncRuntimeCache
from vercel.workers import subscribe

cache = AsyncRuntimeCache(namespace="queue-subscribers")


async def store_result(
    task: dict[str, Any],
    operation: str,
    result: int | float,
) -> None:
    task_id = str(task["task_id"])
    await cache.set(
        task_id,
        {
            "task_id": task_id,
            "operation": operation,
            "result": result,
            "status": "completed",
        },
        {"ttl": 3600, "tags": ["queue-task-results"]},
    )


@subscribe(topic="add")
async def add(task) -> None:
    await store_result(task, "add", task["left"] + task["right"])


@subscribe(topic="multiply")
async def multiply(task) -> None:
    await store_result(task, "multiply", task["left"] * task["right"])
