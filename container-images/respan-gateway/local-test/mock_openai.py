# Fake OpenAI upstream for local testing: logs each call, answers Chat Completions and Responses.
import json, sys, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def _send(self, code, body, ctype="application/json"):
        data = body.encode() if isinstance(body, str) else body
        self.send_response(code); self.send_header("content-type", ctype)
        self.send_header("content-length", str(len(data))); self.end_headers(); self.wfile.write(data)
    def do_GET(self):
        print("UPSTREAM GET", self.path, flush=True)
        self._send(200, json.dumps({"object": "list", "data": [{"id": "gpt-mock", "object": "model"}]}))
    def do_POST(self):
        req = json.loads(self.rfile.read(int(self.headers.get("content-length", 0))) or b"{}")
        print("UPSTREAM POST", self.path, "auth=" + self.headers.get("authorization", "")[:16],
              "model=" + str(req.get("model")), "stream=" + str(req.get("stream")), flush=True)
        text = "Hello from the mock upstream"
        if self.path.endswith("/chat/completions"):
            if req.get("stream"):
                self.send_response(200); self.send_header("content-type", "text/event-stream"); self.end_headers()
                for i, w in enumerate(text.split(" ")):
                    chunk = {"id": "c1", "object": "chat.completion.chunk", "created": 0, "model": req["model"],
                             "choices": [{"index": 0, "delta": ({"role": "assistant"} if i == 0 else {}) | {"content": ("" if i == 0 else " ") + w}, "finish_reason": None}]}
                    self.wfile.write(f"data: {json.dumps(chunk)}\n\n".encode()); self.wfile.flush()
                end = {"id": "c1", "object": "chat.completion.chunk", "created": 0, "model": req["model"],
                       "choices": [{"index": 0, "delta": {}, "finish_reason": "stop"}],
                       "usage": {"prompt_tokens": 5, "completion_tokens": 5, "total_tokens": 10}}
                self.wfile.write(f"data: {json.dumps(end)}\n\ndata: [DONE]\n\n".encode()); self.wfile.flush()
                return
            self._send(200, json.dumps({"id": "c1", "object": "chat.completion", "created": int(time.time()), "model": req["model"],
                "choices": [{"index": 0, "message": {"role": "assistant", "content": text}, "finish_reason": "stop"}],
                "usage": {"prompt_tokens": 5, "completion_tokens": 5, "total_tokens": 10}}))
        elif self.path.endswith("/responses"):
            self._send(200, json.dumps({"id": "r1", "object": "response", "created_at": 0, "status": "completed", "model": req["model"],
                "output": [{"type": "message", "id": "m1", "role": "assistant", "status": "completed",
                            "content": [{"type": "output_text", "text": text, "annotations": []}]}],
                "usage": {"input_tokens": 5, "output_tokens": 5, "total_tokens": 10}}))
        else:
            self._send(404, json.dumps({"error": {"message": "mock: unknown path " + self.path}}))

ThreadingHTTPServer(("0.0.0.0", int(sys.argv[1]) if len(sys.argv) > 1 else 9999), H).serve_forever()
