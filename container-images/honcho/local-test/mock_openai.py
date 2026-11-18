# Fake OpenAI upstream for local testing: answers Embeddings and Chat Completions, logs each call.
import base64, hashlib, json, struct, sys, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

FACT = "Alice loves hiking in the Alps."

def vector(text, dims):
    digest = hashlib.sha256(text.encode()).digest()
    return [(digest[i % len(digest)] / 255.0) * 2 - 1 for i in range(dims)]

class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def _send(self, code, body):
        data = json.dumps(body).encode()
        self.send_response(code); self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(data))); self.end_headers(); self.wfile.write(data)
    def do_POST(self):
        req = json.loads(self.rfile.read(int(self.headers.get("content-length", 0))) or b"{}")
        kind = "json" if req.get("response_format") else ("stream" if req.get("stream") else "text")
        print("UPSTREAM POST", self.path, "auth=" + self.headers.get("authorization", "")[:16],
              "model=" + str(req.get("model")), ("mode=" + kind) if "chat" in self.path else "", flush=True)
        if self.path.endswith("/embeddings"):
            inputs = req.get("input"); inputs = [inputs] if isinstance(inputs, str) else inputs
            dims = int(req.get("dimensions") or 1536)
            data = []
            for i, text in enumerate(inputs):
                v = vector(str(text), dims)
                emb = base64.b64encode(struct.pack(f"<{dims}f", *v)).decode() if req.get("encoding_format") == "base64" else v
                data.append({"object": "embedding", "index": i, "embedding": emb})
            return self._send(200, {"object": "list", "data": data, "model": req.get("model"),
                                    "usage": {"prompt_tokens": 1, "total_tokens": 1}})
        if not self.path.endswith("/chat/completions"):
            return self._send(404, {"error": {"message": "mock: unknown path " + self.path}})
        # Structured output (the deriver) gets one extracted fact; everything else gets plain text.
        text = json.dumps({"explicit": [{"content": FACT}]}) if kind == "json" else "Alice loves hiking (mock answer)."
        usage = {"prompt_tokens": 5, "completion_tokens": 5, "total_tokens": 10}
        if kind == "stream":
            self.send_response(200); self.send_header("content-type", "text/event-stream"); self.end_headers()
            for i, w in enumerate(text.split(" ")):
                chunk = {"id": "c1", "object": "chat.completion.chunk", "created": 0, "model": req.get("model"),
                         "choices": [{"index": 0, "delta": {"role": "assistant", "content": ("" if i == 0 else " ") + w}, "finish_reason": None}]}
                self.wfile.write(f"data: {json.dumps(chunk)}\n\n".encode()); self.wfile.flush()
            end = {"id": "c1", "object": "chat.completion.chunk", "created": 0, "model": req.get("model"),
                   "choices": [{"index": 0, "delta": {}, "finish_reason": "stop"}], "usage": usage}
            self.wfile.write(f"data: {json.dumps(end)}\n\ndata: [DONE]\n\n".encode()); self.wfile.flush()
            return
        self._send(200, {"id": "c1", "object": "chat.completion", "created": int(time.time()), "model": req.get("model"),
                         "choices": [{"index": 0, "message": {"role": "assistant", "content": text}, "finish_reason": "stop"}],
                         "usage": usage})

ThreadingHTTPServer(("0.0.0.0", int(sys.argv[1]) if len(sys.argv) > 1 else 9999), H).serve_forever()
