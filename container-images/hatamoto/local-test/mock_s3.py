# Fake S3-compatible bucket for local testing (path-style, no signature checks): PUT, GET, HEAD, DELETE, ListObjectsV2.
import hashlib, sys, time
from email.utils import formatdate
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit, parse_qs, unquote
from xml.sax.saxutils import escape

OBJECTS = {}  # (bucket, key) -> (bytes, headers)

class H(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    def log_message(self, *a): pass
    def _split(self):
        u = urlsplit(self.path)
        bucket, _, key = unquote(u.path).lstrip("/").partition("/")
        return bucket, key, parse_qs(u.query, keep_blank_values=True)
    def _send(self, code, body=b"", headers=None, head=False):
        self.send_response(code)
        for k, v in (headers or {}).items(): self.send_header(k, v)
        self.send_header("content-length", str(len(body))); self.end_headers()
        if not head: self.wfile.write(body)
    def do_PUT(self):
        bucket, key, _ = self._split()
        data = self.rfile.read(int(self.headers.get("content-length", 0)))
        meta = {k: v for k, v in self.headers.items() if k.lower().startswith("x-amz-meta-") or k.lower() in ("content-type", "cache-control")}
        etag = '"%s"' % hashlib.md5(data).hexdigest()
        OBJECTS[(bucket, key)] = (data, meta | {"ETag": etag, "Last-Modified": formatdate(usegmt=True)})
        print("S3 PUT", bucket + "/" + key, len(data), "bytes", flush=True)
        self._send(200, headers={"ETag": etag})
    def _get(self, head):
        bucket, key, q = self._split()
        if not key and q.get("list-type") == ["2"]:
            prefix = q.get("prefix", [""])[0]
            items = "".join("<Contents><Key>%s</Key><Size>%d</Size><ETag>%s</ETag><LastModified>%s</LastModified></Contents>"
                            % (escape(k), len(d), escape(h["ETag"]), time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()))
                            for (b, k), (d, h) in sorted(OBJECTS.items()) if b == bucket and k.startswith(prefix))
            body = ('<?xml version="1.0" encoding="UTF-8"?><ListBucketResult><Name>%s</Name><IsTruncated>false</IsTruncated>%s</ListBucketResult>'
                    % (escape(bucket), items)).encode()
            print("S3 LIST", bucket, "prefix=" + prefix, flush=True)
            return self._send(200, body, {"content-type": "application/xml"}, head)
        obj = OBJECTS.get((bucket, key))
        if obj is None:
            return self._send(404, b'<?xml version="1.0"?><Error><Code>NoSuchKey</Code></Error>', {"content-type": "application/xml"}, head)
        print("S3", "HEAD" if head else "GET", bucket + "/" + key, flush=True)
        self._send(200, obj[0], obj[1], head)
    def do_GET(self): self._get(False)
    def do_HEAD(self): self._get(True)
    def do_DELETE(self):
        bucket, key, _ = self._split()
        OBJECTS.pop((bucket, key), None)
        print("S3 DELETE", bucket + "/" + key, flush=True)
        self._send(204)

ThreadingHTTPServer(("0.0.0.0", int(sys.argv[1]) if len(sys.argv) > 1 else 9000), H).serve_forever()
