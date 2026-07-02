import asyncio
import json
import os

import ai
from flask import Flask
from flask_sock import Sock

app = Flask(__name__)
sock = Sock(app)

SYSTEM_PROMPT = "You are a helpful assistant."

BUILDERS = {
    "user": ai.user_message,
    "assistant": ai.assistant_message,
    "system": ai.system_message,
}


@app.get("/api/")
def health():
    return {"status": "ok"}


async def stream_reply(ws, messages):
    model = ai.get_model(os.environ.get("AI_MODEL", "anthropic/claude-sonnet-4-6"))
    try:
        async with ai.stream(
            model,
            [ai.system_message(SYSTEM_PROMPT)] + messages,
        ) as stream:
            async for event in stream:
                if isinstance(event, ai.events.TextDelta):
                    ws.send(json.dumps({"type": "text_delta", "content": event.chunk}))
        ws.send(json.dumps({"type": "text_done"}))
    finally:
        await model.provider.aclose()


@sock.route("/api/ws")
def websocket_endpoint(ws):
    while True:
        raw = ws.receive()
        if raw is None:
            break
        data = json.loads(raw)
        if data.get("type") == "message":
            messages = [
                BUILDERS[m["role"]](m["content"]) for m in data.get("messages", [])
            ]
            try:
                asyncio.run(stream_reply(ws, messages))
            except Exception as e:
                ws.send(json.dumps({"type": "error", "content": str(e)}))
