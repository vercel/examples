# Fake OpenAI-compatible model server for local testing. It plays the manager: its first turn
# spawns a "subagent" (the player) with a fixed instruction, later turns close the mission.
import json, sys, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

INSTRUCTION = "MOCK-755: list the files in /home/dan and report back"

class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def _send(self, code, body):
        data = json.dumps(body).encode()
        self.send_response(code); self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(data))); self.end_headers(); self.wfile.write(data)
    def do_GET(self):
        print("MOCK GET", self.path, flush=True)
        if self.path.endswith("/models"):
            return self._send(200, {"object": "list", "data": [{"id": "mock-manager", "object": "model"}]})
        self._send(404, {"error": {"message": "mock: unknown path " + self.path}})
    def do_POST(self):
        req = json.loads(self.rfile.read(int(self.headers.get("content-length", 0))) or b"{}")
        if not self.path.endswith("/chat/completions"):
            return self._send(404, {"error": {"message": "mock: unknown path " + self.path}})
        tools = [t["function"]["name"] for t in req.get("tools", [])]
        spawned = any(m.get("role") == "tool" for m in req.get("messages", []))
        print("MOCK POST", self.path, "model=" + str(req.get("model")), "tools=" + ",".join(tools),
              "messages=" + str(len(req.get("messages", []))), flush=True)
        if "Agent" in tools and not spawned:
            call = {"id": "call_1", "type": "function",
                    "function": {"name": "Agent", "arguments": json.dumps({"description": "List files", "prompt": INSTRUCTION})}}
            msg, finish = {"role": "assistant", "content": None, "tool_calls": [call]}, "tool_calls"
        elif "MissionComplete" in tools:
            call = {"id": "call_2", "type": "function",
                    "function": {"name": "MissionComplete", "arguments": json.dumps({"summary": "Done."})}}
            msg, finish = {"role": "assistant", "content": None, "tool_calls": [call]}, "tool_calls"
        else:
            msg, finish = {"role": "assistant", "content": "Adequate work. Review: 3/5."}, "stop"
        self._send(200, {"id": "c1", "object": "chat.completion", "created": int(time.time()), "model": req.get("model"),
                         "choices": [{"index": 0, "message": msg, "finish_reason": finish}],
                         "usage": {"prompt_tokens": 5, "completion_tokens": 5, "total_tokens": 10}})

ThreadingHTTPServer(("0.0.0.0", int(sys.argv[1]) if len(sys.argv) > 1 else 9999), H).serve_forever()
