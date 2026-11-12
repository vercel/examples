# Serve ./dist like a static host for local testing (stdlib only). Usage: python3 local-test/serve.py [port]
import functools, os, sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "dist")
port = int(sys.argv[1]) if len(sys.argv) > 1 else int(os.environ.get("PORT", "4173"))

class Handler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, ".js": "text/javascript", ".md": "text/markdown"}
    def log_message(self, *a): pass

print(f"Serving {os.path.normpath(root)} on http://localhost:{port}", flush=True)
ThreadingHTTPServer(("127.0.0.1", port), functools.partial(Handler, directory=root)).serve_forever()
