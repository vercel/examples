import os

import ai, fastapi

app = fastapi.FastAPI()

MODEL = ai.get_model(os.environ.get("AI_MODEL", "anthropic/claude-sonnet-4-6"))
SYSTEM_PROMPT = "You are a helpful assistant."

BUILDERS = {
    "user": ai.user_message,
    "assistant": ai.assistant_message,
    "system": ai.system_message,
}

api = fastapi.APIRouter(prefix="/api")


@api.get("/")
async def health():
    return {"status": "ok"}


@api.websocket("/ws")
async def websocket_endpoint(websocket: fastapi.WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            if data.get("type") == "message":
                raw = data.get("messages", [])
                messages = [BUILDERS[m["role"]](m["content"]) for m in raw]
                try:
                    async with ai.stream(
                        MODEL,
                        [ai.system_message(SYSTEM_PROMPT)] + messages,
                    ) as stream:
                        async for event in stream:
                            if isinstance(event, ai.events.TextDelta):
                                await websocket.send_json(
                                    {"type": "text_delta", "content": event.chunk}
                                )
                        await websocket.send_json({"type": "text_done"})
                except Exception as e:
                    await websocket.send_json(
                        {"type": "error", "content": str(e)}
                    )
    except fastapi.WebSocketDisconnect:
        pass

app.include_router(api)
