# Minimal stdlib WebSocket client for the smoke test.
# Usage: ws_client.py URL [TOKEN] [FRAME_JSON ...]  Prints the handshake status, then each server frame as one JSON line.
# After each frame it sends, it waits for the reply: a session status, or the end-of-turn "cost" frame.
import base64, json, os, socket, struct, sys, urllib.parse

def connect(url, token):
    u = urllib.parse.urlparse(url)
    s = socket.create_connection((u.hostname, u.port or 80), timeout=60)
    key = base64.b64encode(os.urandom(16)).decode()
    hdr = [f"GET {u.path or '/'} HTTP/1.1", f"Host: {u.hostname}:{u.port}", "Upgrade: websocket",
           "Connection: Upgrade", f"Sec-WebSocket-Key: {key}", "Sec-WebSocket-Version: 13"]
    if token: hdr.append(f"Authorization: Bearer {token}")
    s.sendall(("\r\n".join(hdr) + "\r\n\r\n").encode())
    resp = b""
    while b"\r\n\r\n" not in resp:
        chunk = s.recv(4096)
        if not chunk: break
        resp += chunk
    status = int(resp.split(b" ", 2)[1])
    return s, status, resp.split(b"\r\n\r\n", 1)[1]

def send(s, text):
    data = text.encode(); mask = os.urandom(4); n = len(data)
    head = bytes([0x81]) + (bytes([0x80 | n]) if n < 126 else bytes([0x80 | 126]) + struct.pack(">H", n) if n < 65536 else bytes([0x80 | 127]) + struct.pack(">Q", n))
    s.sendall(head + mask + bytes(b ^ mask[i % 4] for i, b in enumerate(data)))

class Reader:
    def __init__(self, s, buf): self.s, self.buf = s, buf
    def take(self, n):
        while len(self.buf) < n:
            c = self.s.recv(65536)
            if not c: raise EOFError
            self.buf += c
        out, self.buf = self.buf[:n], self.buf[n:]
        return out
    def frame(self):
        b1, b2 = self.take(2); n = b2 & 0x7F
        if n == 126: n = struct.unpack(">H", self.take(2))[0]
        elif n == 127: n = struct.unpack(">Q", self.take(8))[0]
        return b1 & 0x0F, self.take(n)

def main():
    url, token, frames = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else ""), sys.argv[3:]
    s, status, rest = connect(url, token)
    print(json.dumps({"handshake": status}), flush=True)
    if status != 101: return
    r = Reader(s, rest)
    def read_until(pred):
        while True:
            op, payload = r.frame()
            if op == 8: print(json.dumps({"closed": True}), flush=True); return None
            if op != 1: continue
            msg = json.loads(payload); print(json.dumps(msg), flush=True)
            if pred(msg): return msg
    read_until(lambda m: True)  # welcome frame
    for f in frames:
        send(s, f); t = json.loads(f)["type"]
        read_until((lambda m: m.get("type") in ("status", "error")) if t == "session" else (lambda m: m.get("type") in ("cost", "error")))
    s.close()

main()
