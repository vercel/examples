# Fake OpenAI-compatible upstream (stands in for AI Gateway at https://ai-gateway.vercel.sh/v1).
# Stdlib only. Logs each call and answers Chat Completions, streaming or not.
import json, sys, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

TEXT = "Antfly answered from the retrieved documents"

class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass

    def _json(self, code, obj):
        data = json.dumps(obj).encode()
        self.send_response(code); self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(data))); self.end_headers(); self.wfile.write(data)

    def do_GET(self):
        print("UPSTREAM GET", self.path, flush=True)
        self._json(200, {"object": "list", "data": [{"id": "openai/gpt-mock", "object": "model"}]})

    def do_POST(self):
        req = json.loads(self.rfile.read(int(self.headers.get("content-length", 0))) or b"{}")
        print("UPSTREAM POST", self.path, "auth=" + self.headers.get("authorization", "")[:16],
              "model=" + str(req.get("model")), "stream=" + str(req.get("stream")), flush=True)
        if not self.path.endswith("/chat/completions"):
            return self._json(404, {"error": {"message": "mock: unknown path " + self.path}})
        model = req.get("model", "openai/gpt-mock")
        if req.get("stream"):
            self.send_response(200); self.send_header("content-type", "text/event-stream"); self.end_headers()
            for i, w in enumerate(TEXT.split(" ")):
                delta = {"role": "assistant", "content": w} if i == 0 else {"content": " " + w}
                chunk = {"id": "c1", "object": "chat.completion.chunk", "created": 0, "model": model,
                         "choices": [{"index": 0, "delta": delta, "finish_reason": None}]}
                self.wfile.write(f"data: {json.dumps(chunk)}\n\n".encode()); self.wfile.flush()
            end = {"id": "c1", "object": "chat.completion.chunk", "created": 0, "model": model,
                   "choices": [{"index": 0, "delta": {}, "finish_reason": "stop"}],
                   "usage": {"prompt_tokens": 5, "completion_tokens": 6, "total_tokens": 11}}
            self.wfile.write(f"data: {json.dumps(end)}\n\ndata: [DONE]\n\n".encode()); self.wfile.flush()
            return
        self._json(200, {"id": "c1", "object": "chat.completion", "created": int(time.time()), "model": model,
                         "choices": [{"index": 0, "message": {"role": "assistant", "content": TEXT}, "finish_reason": "stop"}],
                         "usage": {"prompt_tokens": 5, "completion_tokens": 6, "total_tokens": 11}})

ThreadingHTTPServer(("0.0.0.0", int(sys.argv[1]) if len(sys.argv) > 1 else 9999), H).serve_forever()
