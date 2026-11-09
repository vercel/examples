# Fake Grayson decision API for local testing, served over HTTPS as api.finic.ai.
# Answers every question in POST /v1/decide with a low-risk answer and logs each call.
import json, ssl, sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

def answer(q):
    t = q.get("type")
    if t == "noul":
        return {"type": "noul", "value": False, "probability": 0.08}
    if t == "choice":
        keys = list(q.get("options", {})) or ["none"]
        return {"type": "choice", "value": keys[0], "probabilities": {k: (0.9 if i == 0 else 0.1 / max(len(keys) - 1, 1)) for i, k in enumerate(keys)}}
    if t == "multi_choice":
        return {"type": "multi_choice", "values": [], "probabilities": {k: 0.05 for k in q.get("options", {})}}
    levels = q.get("levels") or ["low"]
    return {"type": "score", "value": 0, "level": levels[0], "probabilities": [1.0] + [0.0] * (len(levels) - 1)}

class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_POST(self):
        req = json.loads(self.rfile.read(int(self.headers.get("content-length", 0))) or b"{}")
        qs = req.get("questions", {})
        print("GRAYSON POST", self.path, "auth=" + self.headers.get("authorization", "")[:16],
              "questions=" + ",".join(qs), flush=True)
        if self.path != "/v1/decide":
            body, code = {"error": "mock: unknown path " + self.path}, 404
        else:
            body, code = {"id": "mock_1", "model": req.get("model", "mock"),
                          "answers": {k: answer(q) for k, q in qs.items()}, "usage": {"input_tokens": 42}}, 200
        data = json.dumps(body).encode()
        self.send_response(code); self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(data))); self.end_headers(); self.wfile.write(data)

port, cert, key = int(sys.argv[1]), sys.argv[2], sys.argv[3]
srv = ThreadingHTTPServer(("0.0.0.0", port), H)
ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER); ctx.load_cert_chain(cert, key)
srv.socket = ctx.wrap_socket(srv.socket, server_side=True)
srv.serve_forever()
