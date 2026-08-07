import logging
from typing import Any

from vercel.workers import subscribe

from store import result_store

logger = logging.getLogger("queue-subscribers")
logger.setLevel(logging.INFO)


async def store_result(
    task: dict[str, Any],
    operation: str,
    result: int | float,
) -> None:
    task_id = str(task["task_id"])
    logger.info(
        "Processing task task_id=%s operation=%s",
        task_id,
        operation,
    )
    await result_store.set(
        task_id,
        {
            "task_id": task_id,
            "operation": operation,
            "result": result,
            "status": "completed",
        },
    )
    logger.info(
        "Task completed task_id=%s operation=%s result=%s",
        task_id,
        operation,
        result,
    )


@subscribe(topic="add")
async def add(task) -> None:
    await store_result(task, "add", task["left"] + task["right"])


@subscribe(topic="multiply")
async def multiply(task) -> None:
    await store_result(task, "multiply", task["left"] * task["right"])
