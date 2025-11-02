import os
from typing import Any
import httpx
from fastapi import APIRouter
from vercel.oidc.aio import get_vercel_oidc_token


router = APIRouter(prefix="/api", tags=["models"])


ALLOWED_MODELS: list[str] = [
    "anthropic/claude-sonnet-4.5",
    "anthropic/claude-sonnet-4",
    "anthropic/claude-3.7-sonnet",
    "anthropic/claude-3.5-haiku",
    "xai/grok-4",
    "xai/grok-4-fast-non-reasoning",
    "openai/gpt-4.1",
    "openai/gpt-4.1-mini",
    "openai/gpt-5",
    "openai/gpt-5-mini",
]


@router.get("/models")
async def list_models() -> dict[str, Any]:
    oidc_token = await get_vercel_oidc_token()
    result = list(ALLOWED_MODELS)

    api_key = os.getenv("VERCEL_AI_GATEWAY_API_KEY", oidc_token)
    gateway_base = (
        os.getenv("AI_GATEWAY_BASE_URL")
        or os.getenv("OPENAI_BASE_URL")
        or "https://ai-gateway.vercel.sh/v1"
    )

    if not api_key:
        return {"models": result}

    url = f"{gateway_base.rstrip('/')}/models"
    headers = {"Authorization": f"Bearer {api_key}"}
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(url, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            available_ids = {
                str(m.get("id")) for m in (data.get("data") or []) if m.get("id")
            }
            intersected = [m for m in ALLOWED_MODELS if m in available_ids]
            return {"models": intersected or result}
    except httpx.HTTPError:
        return {"models": result}
