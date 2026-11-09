# Fake OpenAI-compatible Chat Completions upstream (stands in for AI Gateway). Logs each call.
import json, sys, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

TEXT = "Hello from the mock model"

class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def _send(self, code, body):
        data = json.dumps(body).encode()
        self.send_response(code); self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(data))); self.end_headers(); self.wfile.write(data)
    def do_GET(self):
        print("UPSTREAM GET", self.path, flush=True)
        self._send(200, {"object": "list", "data": [{"id": "mock-model", "object": "model"}]})
    def do_POST(self):
        req = json.loads(self.rfile.read(int(self.headers.get("content-length", 0))) or b"{}")
        print("UPSTREAM POST", self.path, "auth=" + self.headers.get("authorization", ""),
              "model=" + str(req.get("model")), "stream=" + str(req.get("stream")), flush=True)
        if not self.path.endswith("/chat/completions"):
            return self._send(404, {"error": {"message": "mock: unknown path " + self.path}})
        model = req.get("model", "mock-model")
        usage = {"prompt_tokens": 5, "completion_tokens": 5, "total_tokens": 10}
        if req.get("stream"):
            self.send_response(200); self.send_header("content-type", "text/event-stream"); self.end_headers()
            for i, w in enumerate(TEXT.split(" ")):
                delta = ({"role": "assistant"} if i == 0 else {}) | {"content": ("" if i == 0 else " ") + w}
                chunk = {"id": "c1", "object": "chat.completion.chunk", "created": 0, "model": model,
                         "choices": [{"index": 0, "delta": delta, "finish_reason": None}]}
                self.wfile.write(f"data: {json.dumps(chunk)}\n\n".encode()); self.wfile.flush()
            end = {"id": "c1", "object": "chat.completion.chunk", "created": 0, "model": model,
                   "choices": [{"index": 0, "delta": {}, "finish_reason": "stop"}], "usage": usage}
            self.wfile.write(f"data: {json.dumps(end)}\n\ndata: [DONE]\n\n".encode()); self.wfile.flush()
            return
        self._send(200, {"id": "c1", "object": "chat.completion", "created": int(time.time()), "model": model,
                         "choices": [{"index": 0, "message": {"role": "assistant", "content": TEXT}, "finish_reason": "stop"}],
                         "usage": usage})

ThreadingHTTPServer(("0.0.0.0", int(sys.argv[1]) if len(sys.argv) > 1 else 9999), H).serve_forever()
