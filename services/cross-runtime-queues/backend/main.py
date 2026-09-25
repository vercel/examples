from datetime import datetime, timezone
from typing import Any, Literal
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from vercel.queue import send

from store import result_store


class DemoMessage(BaseModel):
    text: str
    sentAt: str | None = None


class TaskRecord(BaseModel):
    taskId: str
    expectedConsumers: list[Literal["nextjs", "python"]]
    messageId: str | None = None


class Completion(BaseModel):
    result: dict[str, Any]


app = FastAPI(title="Cross-runtime Vercel Queues demo")


def task_key(task_id: str) -> str:
    return f"task:{task_id}"


def completion_key(task_id: str, consumer: str) -> str:
    return f"task:{task_id}:completion:{consumer}"


@app.put("/api/python/tasks/{task_id}", status_code=204)
async def put_task(task_id: str, task: TaskRecord) -> None:
    if task.taskId != task_id:
        raise HTTPException(status_code=400, detail="Task ID mismatch")
    await result_store.set(task_key(task_id), task.model_dump())


@app.delete("/api/python/tasks/{task_id}", status_code=204)
async def delete_task(task_id: str) -> None:
    await result_store.delete(task_key(task_id))


@app.put(
    "/api/python/tasks/{task_id}/completions/{consumer}",
    status_code=204,
)
async def put_completion(
    task_id: str,
    consumer: Literal["nextjs", "python"],
    completion: Completion,
) -> None:
    await result_store.set(
        completion_key(task_id, consumer),
        completion.model_dump(),
    )


@app.get("/api/python/tasks/{task_id}")
async def get_task(task_id: str) -> dict[str, Any]:
    task = await result_store.get(task_key(task_id))
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    completions: dict[str, Any] = {}
    for consumer in task["expectedConsumers"]:
        completion = await result_store.get(completion_key(task_id, consumer))
        if completion is not None:
            completions[consumer] = completion

    return {
        **task,
        "status": (
            "completed"
            if len(completions) == len(task["expectedConsumers"])
            else "pending"
        ),
        "completions": completions,
    }


@app.post("/api/python/messages/python-to-next")
async def send_to_next(message: DemoMessage) -> TaskRecord:
    task_id = str(uuid4())
    payload = message.model_dump()
    payload["sentAt"] = payload["sentAt"] or datetime.now(timezone.utc).isoformat()
    payload["taskId"] = task_id
    task = TaskRecord(
        taskId=task_id,
        expectedConsumers=["nextjs"],
    )

    await result_store.set(task_key(task_id), task.model_dump())
    try:
        message_id = await send("demo-python-to-next", payload)
    except Exception:
        await result_store.delete(task_key(task_id))
        raise

    task.messageId = message_id
    await result_store.set(task_key(task_id), task.model_dump())

    return task
