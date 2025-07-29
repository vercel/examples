import { defineCommand, runMain as runMain$1 } from 'citty';
import consola from 'consola';
import { startTunnel } from './index.mjs';
import 'node:fs';

const name = "untun";
const version = "0.1.3";
const description = "Tunnel your local HTTP(s) server to the world! Powered by Cloudflare Quick Tunnels.";

const tunnel = defineCommand({
  meta: {
    name: "tunnel",
    description: "Create a tunnel to a local server"
  },
  args: {
    url: {
      type: "positional",
      description: "The URL of the tunnel",
      required: false
    },
    port: {
      type: "string",
      description: "The port of the tunnel (default: 3000)"
    },
    hostname: {
      type: "string",
      description: "The hostname of the tunnel (default: localhost)",
      valueHint: "localhost|example.com"
    },
    protocol: {
      type: "string",
      description: "The protocol of the tunnel (default: http)",
      valueHint: "http|https"
    }
  },
  async run({ args }) {
    const tunnel2 = await startTunnel({
      url: args.url
    });
    if (!tunnel2) {
      console.log("Tunnel not started.");
      process.exit(1);
    }
    consola.info("Waiting for tunnel URL...");
    consola.success(`Tunnel ready at \`${await tunnel2.getURL()}\``);
  }
});
const main = defineCommand({
  meta: {
    name,
    description,
    version
  },
  subCommands: {
    tunnel
  }
});
const runMain = () => runMain$1(main);

export { main, runMain, tunnel };
