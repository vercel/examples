import asyncio
import json
import os

import ai
from flask import Flask
from flask_sock import Sock

app = Flask(__name__)
sock = Sock(app)

MODEL = ai.get_model(os.environ.get("AI_MODEL", "anthropic/claude-sonnet-4-6"))
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
    async with ai.stream(
        MODEL,
        [ai.system_message(SYSTEM_PROMPT)] + messages,
    ) as stream:
        async for event in stream:
            if isinstance(event, ai.events.TextDelta):
                ws.send(json.dumps({"type": "text_delta", "content": event.chunk}))
    ws.send(json.dumps({"type": "text_done"}))


@sock.route("/api/ws")
def websocket_endpoint(ws):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        while True:
            raw = ws.receive()
            if raw is None:
                break
            data = json.loads(raw)
            if data.get("type") == "message":
                messages = [
                    BUILDERS[m["role"]](m["content"])
                    for m in data.get("messages", [])
                ]
                try:
                    loop.run_until_complete(stream_reply(ws, messages))
                except Exception as e:
                    ws.send(json.dumps({"type": "error", "content": str(e)}))
    finally:
        loop.close()
