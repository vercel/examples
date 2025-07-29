'use strict';

const citty = require('citty');
const consola = require('consola');
const index = require('./index.cjs');
require('node:fs');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const consola__default = /*#__PURE__*/_interopDefaultCompat(consola);

const name = "untun";
const version = "0.1.3";
const description = "Tunnel your local HTTP(s) server to the world! Powered by Cloudflare Quick Tunnels.";

const tunnel = citty.defineCommand({
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
    const tunnel2 = await index.startTunnel({
      url: args.url
    });
    if (!tunnel2) {
      console.log("Tunnel not started.");
      process.exit(1);
    }
    consola__default.info("Waiting for tunnel URL...");
    consola__default.success(`Tunnel ready at \`${await tunnel2.getURL()}\``);
  }
});
const main = citty.defineCommand({
  meta: {
    name,
    description,
    version
  },
  subCommands: {
    tunnel
  }
});
const runMain = () => citty.runMain(main);

exports.main = main;
exports.runMain = runMain;
exports.tunnel = tunnel;
