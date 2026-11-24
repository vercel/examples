# Fake Prometheus for local testing: answers the HTTP API paths SlashObserve calls with one fixed series.
import json, sys, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs

SERIES = {"__name__": "http_requests_total", "job": "checkout", "pod": "checkout-0"}

class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def _ok(self, data):
        body = json.dumps({"status": "success", "data": data}).encode()
        self.send_response(200); self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(body))); self.end_headers(); self.wfile.write(body)
    def _params(self):
        q = parse_qs(urlparse(self.path).query)
        if self.command == "POST":
            q.update(parse_qs(self.rfile.read(int(self.headers.get("content-length", 0))).decode()))
        return {k: v[0] for k, v in q.items()}
    def handle_any(self):
        path, p = urlparse(self.path).path, self._params()
        print("PROMETHEUS", self.command, path, p.get("query", ""), flush=True)
        now = time.time()
        if path == "/api/v1/query":
            self._ok({"resultType": "vector", "result": [{"metric": SERIES, "value": [now, "42"]}]})
        elif path == "/api/v1/query_range":
            start, end = float(p.get("start", now - 3600)), float(p.get("end", now))
            step = max(float(p.get("step", 60) or 60), 1.0)
            vals, t = [], start
            while t <= end and len(vals) < 500:
                vals.append([t, str(40 + len(vals) % 5)]); t += step
            self._ok({"resultType": "matrix", "result": [{"metric": SERIES, "values": vals}]})
        elif path in ("/api/v1/labels", "/api/v1/label/__name__/values"):
            self._ok(["__name__", "job", "pod"] if path.endswith("labels") else ["http_requests_total"])
        elif path.startswith("/api/v1/label/"):
            self._ok(["checkout"])
        elif path == "/api/v1/series":
            self._ok([SERIES])
        elif path == "/api/v1/metadata":
            self._ok({"http_requests_total": [{"type": "counter", "help": "Requests.", "unit": ""}]})
        elif path == "/api/v1/status/buildinfo":
            self._ok({"version": "3.0.0", "revision": "mock", "branch": "mock"})
        elif path in ("/-/ready", "/-/healthy"):
            self.send_response(200); self.end_headers(); self.wfile.write(b"OK")
        else:
            self._ok([])
    do_GET = do_POST = handle_any

ThreadingHTTPServer(("0.0.0.0", int(sys.argv[1]) if len(sys.argv) > 1 else 9090), H).serve_forever()
