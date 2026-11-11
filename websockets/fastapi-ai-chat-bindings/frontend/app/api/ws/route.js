import { experimental_upgradeWebSocket } from "@vercel/functions";
import WebSocket from "ws";

// Relays the browser WebSocket to the internal backend over the service binding.
export function GET() {
  return experimental_upgradeWebSocket(
    (client) => {
      const target = new URL("/api/ws", process.env.BACKEND_URL);
      target.protocol = target.protocol === "https:" ? "wss:" : "ws:";
      const upstream = new WebSocket(target);

      // Buffer client messages until the upstream connection is open.
      const pending = [];
      client.on("message", (data, isBinary) => {
        if (upstream.readyState === WebSocket.OPEN) {
          upstream.send(data, { binary: isBinary });
        } else {
          pending.push([data, isBinary]);
        }
      });
      upstream.on("open", () => {
        for (const [data, isBinary] of pending.splice(0)) {
          upstream.send(data, { binary: isBinary });
        }
      });
      upstream.on("message", (data, isBinary) => {
        client.send(data, { binary: isBinary });
      });

      const closeBoth = () => {
        client.close();
        upstream.close();
      };
      client.on("close", closeBoth);
      upstream.on("close", closeBoth);
      client.on("error", closeBoth);
      upstream.on("error", closeBoth);
    },
    // The client resends the full history each turn; raise the 256 KB default.
    { maxPayload: 4 * 1024 * 1024 },
  );
}
