#!/usr/bin/env python3
"""Stdlib-only stand-in for the Supabase REST API (PostgREST), enough for the
Harmony federation backend's health, WebFinger and NodeInfo endpoints.

Only requests carrying the expected service role key get data; every request
is appended to the log file so the smoke test can check what the server sent.
"""
import json
import os
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

PORT = int(os.environ.get("MOCK_PORT", "54321"))
SERVICE_KEY = os.environ.get("MOCK_SERVICE_KEY", "test-service-role-key")
LOG = os.environ.get("MOCK_LOG", "/tmp/mock-supabase.log")

PROFILES = [{"id": "00000000-0000-0000-0000-000000000001", "username": "alice"}]
COUNTS = {"profiles": 3, "posts": 42}


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def _record(self):
        with open(LOG, "a") as f:
            f.write(json.dumps({
                "method": self.command,
                "path": self.path,
                "apikey_ok": self.headers.get("apikey") == SERVICE_KEY,
            }) + "\n")

    def _send(self, status, body=None, headers=None):
        data = b"" if body is None else json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        for k, v in (headers or {}).items():
            self.send_header(k, v)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(data)

    def _authorized(self):
        if self.headers.get("apikey") != SERVICE_KEY:
            self._send(401, {"message": "Invalid API key"})
            return False
        return True

    def _rows(self, table, query):
        if table == "profiles":
            uname = query.get("username", [""])[0]
            if uname.startswith("ilike."):
                want = uname[len("ilike."):].replace("\\_", "_").lower()
                return [p for p in PROFILES if p["username"].lower() == want]
            return PROFILES
        return []

    def do_HEAD(self):
        self._record()
        if not self._authorized():
            return
        table = urlparse(self.path).path.rsplit("/", 1)[-1]
        n = COUNTS.get(table, 0)
        self._send(200, None, {"Content-Range": f"*/{n}"})

    def do_GET(self):
        self._record()
        if not self._authorized():
            return
        url = urlparse(self.path)
        if not url.path.startswith("/rest/v1/"):
            return self._send(404, {"message": "not found"})
        table = url.path.rsplit("/", 1)[-1]
        rows = self._rows(table, parse_qs(url.query))
        if "vnd.pgrst.object" in self.headers.get("Accept", ""):
            if len(rows) == 1:
                return self._send(200, rows[0])
            return self._send(406, {"code": "PGRST116", "message": "0 rows"})
        n = len(rows)
        self._send(200, rows, {"Content-Range": f"0-{max(n - 1, 0)}/{n}"})

    def do_POST(self):
        self._record()
        if not self._authorized():
            return
        length = int(self.headers.get("Content-Length") or 0)
        self.rfile.read(length)
        if urlparse(self.path).path == "/rest/v1/rpc/nodeinfo_active_users":
            return self._send(200, 2)
        self._send(200, [])


if __name__ == "__main__":
    open(LOG, "w").close()
    print(f"mock supabase on :{PORT}", file=sys.stderr)
    ThreadingHTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
