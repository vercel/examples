# Fake overpass-search upstream for local testing: logs each call and answers /search, /complete, /query and /here.
import json, sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs

class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_GET(self):
        u = urlparse(self.path)
        q = parse_qs(u.query).get("q", [""])[0]
        xff = self.headers.get("x-forwarded-for", "")
        print("UPSTREAM GET", u.path, "q=" + q, "x-forwarded-for=" + xff, flush=True)
        if u.path not in ("/search", "/complete", "/query", "/here"):
            body, code = {"error": "mock: unknown path " + u.path}, 404
        else:
            body, code = {"mock": True, "path": u.path, "q": q, "forwardedFor": xff, "results": [
                {"name": "Mock Café", "lat": 47.3717, "lon": 8.5423, "kind": "cafe"}]}, 200
        data = json.dumps(body).encode()
        self.send_response(code)
        self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

ThreadingHTTPServer(("0.0.0.0", int(sys.argv[1]) if len(sys.argv) > 1 else 9998), H).serve_forever()
