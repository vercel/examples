# Fake object storage for local testing: serves one CSV file with HEAD and Range support, and logs each request.
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

CSV = b"""region,product,units,price
emea,keyboard,10,49.5
emea,mouse,25,19.0
amer,keyboard,8,49.5
amer,monitor,3,199.0
apac,mouse,40,19.0
apac,monitor,2,199.0
"""


class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass

    def _head(self):
        if self.path.split("?")[0] != "/sales.csv":
            self.send_response(404); self.send_header("content-length", "0"); self.end_headers(); return None
        start, end = 0, len(CSV) - 1
        rng = self.headers.get("range", "")
        if rng.startswith("bytes="):
            a, _, b = rng[6:].partition("-")
            start, end = int(a or 0), min(int(b) if b else end, end)
            self.send_response(206); self.send_header("content-range", f"bytes {start}-{end}/{len(CSV)}")
        else:
            self.send_response(200)
        self.send_header("content-type", "text/csv"); self.send_header("accept-ranges", "bytes")
        self.send_header("content-length", str(end - start + 1)); self.end_headers()
        return CSV[start:end + 1]

    def do_HEAD(self):
        print("STORAGE HEAD", self.path, flush=True); self._head()

    def do_GET(self):
        print("STORAGE GET", self.path, self.headers.get("range", ""), flush=True)
        body = self._head()
        if body is not None: self.wfile.write(body)


ThreadingHTTPServer(("0.0.0.0", int(sys.argv[1]) if len(sys.argv) > 1 else 9999), H).serve_forever()
