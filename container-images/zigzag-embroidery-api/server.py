"""HTTP wrapper around the ZigZag CLI: SVG in, machine embroidery file out.

  GET  /healthz                      -> "ok"
  GET  /api/formats                  -> the output formats and fabric presets
  POST /api/convert?format=pes       -> body: SVG; response: the stitched file
       &fabric=<preset>&hat=1           (pes, dst, exp, jef, vp3, or png for a preview)
  POST /api/info                     -> body: SVG; response: stitch stats and checks (text)

Env: PORT (default 80), API_KEY (optional: when set, requests to /api/* need
"Authorization: Bearer <API_KEY>"), MAX_SVG_BYTES (default 2000000).
"""
import hmac, json, os, re, signal, subprocess, sys, tempfile, threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

PORT = int(os.environ.get("PORT", "80"))
API_KEY = os.environ.get("API_KEY", "")
MAX_SVG_BYTES = int(os.environ.get("MAX_SVG_BYTES", "2000000"))
TIMEOUT = 120  # seconds per CLI call
FORMATS = {
    "pes": "application/octet-stream", "dst": "application/octet-stream",
    "exp": "application/octet-stream", "jef": "application/octet-stream",
    "vp3": "application/octet-stream", "png": "image/png",
}
FABRIC = re.compile(r"^[a-z0-9-]{1,32}$")


def zigzag(*args, cwd=None):
    return subprocess.run(["zigzag", *args], cwd=cwd, capture_output=True, timeout=TIMEOUT)


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt, *args):
        sys.stderr.write("%s %s\n" % (self.command, fmt % args))

    def send(self, code, body, ctype="text/plain; charset=utf-8", headers=()):
        data = body.encode() if isinstance(body, str) else body
        self.send_response(code)
        self.send_header("content-type", ctype)
        self.send_header("content-length", str(len(data)))
        for k, v in headers:
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(data)

    def authorized(self):
        if not API_KEY:
            return True
        got = self.headers.get("authorization", "")
        return hmac.compare_digest(got.encode(), ("Bearer " + API_KEY).encode())

    def read_svg(self):
        n = int(self.headers.get("content-length") or 0)
        if n <= 0:
            self.send(400, "send the SVG as the request body\n")
            return None
        if n > MAX_SVG_BYTES:
            self.send(413, "SVG is larger than %d bytes\n" % MAX_SVG_BYTES)
            return None
        return self.rfile.read(n)

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/healthz":
            return self.send(200, "ok\n")
        if not path.startswith("/api/"):
            return self.send(200, __doc__)
        if not self.authorized():
            return self.send(401, "missing or wrong API key\n")
        if path == "/api/formats":
            r = zigzag("fabrics")
            fabrics = r.stdout.decode(errors="replace")
            return self.send(200, json.dumps({"formats": sorted(FORMATS), "fabrics": fabrics}), "application/json")
        self.send(404, "not found\n")

    def do_POST(self):
        url = urlparse(self.path)
        if not url.path.startswith("/api/"):
            return self.send(404, "not found\n")
        if not self.authorized():
            return self.send(401, "missing or wrong API key\n")
        if url.path not in ("/api/convert", "/api/info"):
            return self.send(404, "not found\n")
        q = {k: v[-1] for k, v in parse_qs(url.query).items()}
        fmt = q.get("format", "pes").lower()
        if url.path == "/api/convert" and fmt not in FORMATS:
            return self.send(400, "format must be one of: %s\n" % ", ".join(sorted(FORMATS)))
        fabric = q.get("fabric")
        if fabric and not FABRIC.match(fabric):
            return self.send(400, "bad fabric name\n")
        svg = self.read_svg()
        if svg is None:
            return
        with tempfile.TemporaryDirectory() as tmp:
            with open(os.path.join(tmp, "design.svg"), "wb") as f:
                f.write(svg)
            try:
                if url.path == "/api/info":
                    r = zigzag("info", "design.svg", cwd=tmp)
                    # The CLI prints its report on stderr.
                    report = r.stdout + r.stderr
                    return self.send(200 if r.returncode == 0 else 422, report)
                args = ["convert", "design.svg", "-o", "design." + fmt]
                if fabric:
                    args += ["--fabric", fabric]
                if q.get("hat") in ("1", "true"):
                    args.append("--hat")
                r = zigzag(*args, cwd=tmp)
            except subprocess.TimeoutExpired:
                return self.send(504, "conversion took longer than %ds\n" % TIMEOUT)
            out = os.path.join(tmp, "design." + fmt)
            if r.returncode != 0 or not os.path.exists(out):
                return self.send(422, r.stderr or r.stdout or b"conversion failed\n")
            with open(out, "rb") as f:
                data = f.read()
        self.send(200, data, FORMATS[fmt],
                  [("content-disposition", 'attachment; filename="design.%s"' % fmt)])


def main():
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    server.daemon_threads = True

    def stop(signum, _frame):
        print("received signal %d, shutting down" % signum, flush=True)
        threading.Thread(target=server.shutdown, daemon=True).start()

    signal.signal(signal.SIGTERM, stop)
    signal.signal(signal.SIGINT, stop)
    print("zigzag api listening on :%d" % PORT, flush=True)
    server.serve_forever()
    server.server_close()
    print("stopped", flush=True)


if __name__ == "__main__":
    main()
