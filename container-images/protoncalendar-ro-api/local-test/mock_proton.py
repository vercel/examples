# Fake Proton Calendar HTTPS upstream for local testing: serves a sample .ics calendar.
import ssl
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit

SAMPLE_ICS = """BEGIN:VCALENDAR\r
VERSION:2.0\r
PRODID:-//Mock Proton Calendar//EN\r
X-WR-CALNAME:Personal\r
BEGIN:VEVENT\r
UID:allday-1@mock.local\r
DTSTAMP:20261201T000000Z\r
DTSTART;VALUE=DATE:20261211\r
DTEND;VALUE=DATE:20261212\r
SUMMARY:Birthday\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:timed-1@mock.local\r
DTSTAMP:20261201T000000Z\r
DTSTART;TZID=Europe/Rome:20261211T090000\r
DTEND;TZID=Europe/Rome:20261211T094500\r
SUMMARY:Dentist\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:recurring-1@mock.local\r
DTSTAMP:20261201T000000Z\r
DTSTART;TZID=Europe/Rome:20261204T103000\r
DTEND;TZID=Europe/Rome:20261204T110000\r
RRULE:FREQ=WEEKLY;COUNT=4\r
SUMMARY:Team Standup\r
END:VEVENT\r
END:VCALENDAR\r
""".encode("utf-8")


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        path = urlsplit(self.path).path
        has_key = "present" if self.headers.get("x-api-key") else "absent"
        print(f"UPSTREAM GET {path} x-api-key={has_key}", flush=True)
        if path == "/api/calendar/v1/url/mock-calendar/calendar.ics":
            self.send_response(200)
            self.send_header("content-type", "text/calendar; charset=utf-8")
            self.send_header("content-length", str(len(SAMPLE_ICS)))
            self.end_headers()
            self.wfile.write(SAMPLE_ICS)
        else:
            body = b"Not Found"
            self.send_response(404)
            self.send_header("content-type", "text/plain")
            self.send_header("content-length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 443
    certfile = sys.argv[2]
    keyfile = sys.argv[3]
    httpd = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ctx.load_cert_chain(certfile=certfile, keyfile=keyfile)
    httpd.socket = ctx.wrap_socket(httpd.socket, server_side=True)
    httpd.serve_forever()


if __name__ == "__main__":
    main()
