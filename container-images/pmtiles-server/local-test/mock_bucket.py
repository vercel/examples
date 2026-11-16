# Fake object storage for local testing: builds a tiny PMTiles v3 archive in memory and
# serves it with HTTP Range requests, the way a public Vercel Blob store or S3 bucket would.
import hashlib, json, struct, sys, zlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

def png(rgb):  # 256x256 solid-color PNG
    row = b"\x00" + bytes(rgb) * 256
    def chunk(t, d): return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d))
    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", 256, 256, 8, 2, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(row * 256)) + chunk(b"IEND", b""))

def tile_id(z, x, y):  # PMTiles Hilbert tile ID
    acc, n, d, s = (4 ** z - 1) // 3, 1 << z, 0, (1 << z) // 2
    while s > 0:
        rx, ry = int(x & s > 0), int(y & s > 0)
        d += s * s * ((3 * rx) ^ ry)
        if ry == 0:
            if rx == 1: x, y = n - 1 - x, n - 1 - y
            x, y = y, x
        s //= 2
    return acc + d

def varint(v):
    out = b""
    while v >= 0x80: out += bytes([(v & 0x7F) | 0x80]); v >>= 7
    return out + bytes([v])

TILES = {(0, 0, 0): png((40, 120, 200)), (1, 0, 0): png((200, 40, 40)), (1, 1, 0): png((40, 200, 40)),
         (1, 0, 1): png((200, 200, 40)), (1, 1, 1): png((120, 40, 200))}

def archive():
    entries, data = [], b""
    for zxy in sorted(TILES, key=lambda t: tile_id(*t)):
        entries.append((tile_id(*zxy), len(data), len(TILES[zxy]))); data += TILES[zxy]
    d = varint(len(entries))
    last = 0
    for tid, _, _ in entries: d += varint(tid - last); last = tid
    for _ in entries: d += varint(1)
    for _, _, ln in entries: d += varint(ln)
    for i, (_, off, _) in enumerate(entries):
        d += varint(0 if i > 0 and off == entries[i - 1][1] + entries[i - 1][2] else off + 1)
    meta = json.dumps({"name": "mock", "attribution": "local test", "vector_layers": []}).encode()
    root_off, meta_off = 127, 127 + len(d)
    data_off = meta_off + len(meta)
    header = (b"PMTiles" + bytes([3])
              + struct.pack("<QQQQQQQQQQQ", root_off, len(d), meta_off, len(meta), 0, 0, data_off, len(data),
                            len(entries), len(entries), len(entries))
              + bytes([1, 1, 1, 2, 0, 1])  # clustered, no internal/tile compression, PNG, zoom 0-1
              + struct.pack("<iiii", -1800000000, -850511287, 1800000000, 850511287)
              + bytes([0]) + struct.pack("<ii", 0, 0))
    assert len(header) == 127
    return header + d + meta + data

ARCHIVE = archive()
ETAG = '"' + hashlib.sha256(ARCHIVE).hexdigest()[:16] + '"'

class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_GET(self):
        rng = self.headers.get("range", "")
        print("BUCKET GET", self.path, "range=" + rng, flush=True)
        if self.path.split("?")[0] != "/tiles/world.pmtiles":
            self.send_response(404); self.send_header("content-length", "0"); self.end_headers(); return
        if self.headers.get("if-match") not in (None, ETAG):
            self.send_response(412); self.send_header("content-length", "0"); self.end_headers(); return
        start, end, code = 0, len(ARCHIVE) - 1, 200
        if rng.startswith("bytes="):
            a, b = rng[6:].split("-"); start, end, code = int(a), min(int(b), len(ARCHIVE) - 1), 206
        body = ARCHIVE[start:end + 1]
        self.send_response(code); self.send_header("etag", ETAG); self.send_header("accept-ranges", "bytes")
        if code == 206: self.send_header("content-range", f"bytes {start}-{end}/{len(ARCHIVE)}")
        self.send_header("content-length", str(len(body))); self.end_headers(); self.wfile.write(body)

if __name__ == "__main__":
    if len(sys.argv) > 2 and sys.argv[1] == "--tile":  # print a tile's sha256 for the smoke test
        z, x, y = map(int, sys.argv[2].split("/")); print(hashlib.sha256(TILES[(z, x, y)]).hexdigest()); sys.exit()
    ThreadingHTTPServer(("0.0.0.0", int(sys.argv[1]) if len(sys.argv) > 1 else 9999), H).serve_forever()
