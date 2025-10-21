import logging
import time
import traceback
import uuid
from typing import Any, AsyncGenerator

from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from vercel.oidc.aio import get_vercel_oidc_token

from src.agent.agent import run_agent_flow, resume_agent_flow
from src.auth import make_stream_token, read_stream_token
from src.sse import (
    SSE_HEADERS,
    sse_format,
    emit_event,
)
from src.run_store import set_run_payload, get_run_payload


logger = logging.getLogger("ide_agent.api.runs")


router = APIRouter(prefix="/api/runs", tags=["runs"])


class RunRequest(BaseModel):
    """Payload to start a new agent run and get an SSE resume token."""

    user_id: str
    project_id: str
    message_history: list[dict[str, str]]
    query: str
    project: dict[str, str]
    model: str | None = None


def make_task_id() -> str:
    return f"task_{int(time.time() * 1000)}_{uuid.uuid4().hex[:8]}"


@router.post("/")
async def create_run(request: RunRequest) -> dict[str, Any]:
    task_id = make_task_id()
    try:
        logger.info(
            "create_run[%s] model=%s query_len=%d files=%d",
            task_id,
            request.model,
            len(request.query or ""),
            len(request.project or {}),
        )
    except Exception:
        pass

    # Store full payload server-side to keep stream tokens small
    await set_run_payload(
        task_id,
        {
            "user_id": request.user_id,
            "message_history": request.message_history,
            "query": request.query,
            "project": request.project,
            "model": request.model,
            "project_id": request.project_id,
        },
    )
    # Issue a compact token carrying only the run id
    stream_token = make_stream_token({"run_id": task_id})
    return {"task_id": task_id, "stream_token": stream_token}


@router.get("/{run_id}/events")
async def run_events(run_id: str, token: str):
    oidc_token = await get_vercel_oidc_token()
    token_payload = read_stream_token(token)
    if token_payload.get("run_id") != run_id:
        raise HTTPException(status_code=400, detail="Token does not match run id")
    payload = await get_run_payload(run_id)
    if payload is None:
        # Gracefully end the stream with a run_failed event
        async def missing_generator() -> AsyncGenerator[str, None]:
            yield sse_format(
                emit_event(run_id, "run_failed", error="Unknown or expired run id")
            )

        return StreamingResponse(missing_generator(), headers=SSE_HEADERS)

    async def event_generator() -> AsyncGenerator[str, None]:
        try:
            async for chunk in run_agent_flow(payload, run_id, oidc_token=oidc_token):
                yield chunk
        except Exception as e:
            logger.error("run_events[%s] error: %s", run_id, str(e))
            logger.error(traceback.format_exc(limit=10))
            tb = traceback.format_exc(limit=10)
            yield sse_format(
                emit_event(run_id, "run_log", data=f"stream exception: {str(e)}\n{tb}")
            )
            yield sse_format(emit_event(run_id, "run_failed", error=str(e)))

    return StreamingResponse(event_generator(), headers=SSE_HEADERS)


@router.get("/{run_id}/resume")
async def resume_run(run_id: str, token: str, result: str):
    oidc_token = await get_vercel_oidc_token()
    token_payload = read_stream_token(token)
    if token_payload.get("run_id") != run_id:
        raise HTTPException(status_code=400, detail="Token does not match run id")
    base = await get_run_payload(run_id)
    if base is None:

        async def missing_generator() -> AsyncGenerator[str, None]:
            yield sse_format(
                emit_event(run_id, "run_failed", error="Unknown or expired run id")
            )

        return StreamingResponse(missing_generator(), headers=SSE_HEADERS)

    async def event_generator() -> AsyncGenerator[str, None]:
        try:
            async for chunk in resume_agent_flow(base, run_id, result, oidc_token=oidc_token):
                yield chunk
        except Exception as e:
            yield sse_format(emit_event(run_id, "run_failed", error=str(e)))

    return StreamingResponse(event_generator(), headers=SSE_HEADERS)
