# Fake OpenAI-compatible API for local testing: embeddings and chat completions.
# Logs each call so you can see which requests reached the "provider". Stdlib only.
import base64, hashlib, json, struct, sys, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

DIMS = 1536
ANSWER = "Mock answer: the liability cap is twelve months of fees."

def vector(text):
    seed = hashlib.sha256(text.encode()).digest()
    return [((seed[i % 32] + i) % 97) / 97.0 - 0.5 for i in range(DIMS)]

class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def _send(self, code, obj):
        data = json.dumps(obj).encode()
        self.send_response(code); self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(data))); self.end_headers(); self.wfile.write(data)
    def do_GET(self):
        print("MOCK GET", self.path, flush=True)
        self._send(200, {"object": "list", "data": [{"id": "gpt-mock", "object": "model"}]})
    def do_POST(self):
        req = json.loads(self.rfile.read(int(self.headers.get("content-length", 0))) or b"{}")
        print("MOCK POST", self.path, "model=" + str(req.get("model")), "stream=" + str(req.get("stream")), flush=True)
        if self.path.endswith("/embeddings"):
            inputs = req.get("input"); inputs = [inputs] if isinstance(inputs, str) else inputs
            data = []
            for i, text in enumerate(inputs):
                vec = vector(str(text))
                emb = base64.b64encode(struct.pack(f"<{DIMS}f", *vec)).decode() if req.get("encoding_format") == "base64" else vec
                data.append({"object": "embedding", "index": i, "embedding": emb})
            self._send(200, {"object": "list", "data": data, "model": req.get("model"), "usage": {"prompt_tokens": 5, "total_tokens": 5}})
        elif self.path.endswith("/chat/completions"):
            model = req.get("model", "gpt-mock")
            if req.get("stream"):
                self.send_response(200); self.send_header("content-type", "text/event-stream"); self.end_headers()
                for i, w in enumerate(ANSWER.split(" ")):
                    chunk = {"id": "c1", "object": "chat.completion.chunk", "created": 0, "model": model,
                             "choices": [{"index": 0, "delta": {"content": ("" if i == 0 else " ") + w}, "finish_reason": None}]}
                    self.wfile.write(f"data: {json.dumps(chunk)}\n\n".encode()); self.wfile.flush()
                end = {"id": "c1", "object": "chat.completion.chunk", "created": 0, "model": model,
                       "choices": [{"index": 0, "delta": {}, "finish_reason": "stop"}]}
                self.wfile.write(f"data: {json.dumps(end)}\n\ndata: [DONE]\n\n".encode()); self.wfile.flush()
                return
            self._send(200, {"id": "c1", "object": "chat.completion", "created": int(time.time()), "model": model,
                             "choices": [{"index": 0, "message": {"role": "assistant", "content": ANSWER}, "finish_reason": "stop"}],
                             "usage": {"prompt_tokens": 5, "completion_tokens": 5, "total_tokens": 10}})
        else:
            self._send(404, {"error": {"message": "mock: unknown path " + self.path}})

ThreadingHTTPServer(("0.0.0.0", int(sys.argv[1]) if len(sys.argv) > 1 else 9999), H).serve_forever()
