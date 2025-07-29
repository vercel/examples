'use strict';

const fs = require('node:fs');
const consola = require('consola');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const consola__default = /*#__PURE__*/_interopDefaultCompat(consola);

async function startTunnel(opts) {
  const {
    installCloudflared,
    startCloudflaredTunnel,
    cloudflaredBinPath,
    cloudflaredNotice
  } = await import('./chunks/index.cjs');
  const url = opts.url || `${opts.protocol || "http"}://${opts.hostname ?? "localhost"}:${opts.port ?? 3e3}`;
  consola__default.start(`Starting cloudflared tunnel to ${url}`);
  if (!fs.existsSync(cloudflaredBinPath)) {
    consola__default.log(cloudflaredNotice);
    const canInstall = opts.acceptCloudflareNotice || process.env.UNTUN_ACCEPT_CLOUDFLARE_NOTICE || await consola__default.prompt(
      `Do you agree with the above terms and wish to install the binary from GitHub?`,
      {
        type: "confirm"
      }
    );
    if (!canInstall) {
      consola__default.fail("Skipping tunnel setup.");
      return;
    }
    await installCloudflared();
  }
  const args = [
    ["--url", url],
    opts.verifyTLS ? void 0 : ["--no-tls-verify", ""]
  ].filter(Boolean);
  const tunnel = await startCloudflaredTunnel(Object.fromEntries(args));
  const cleanup = async () => {
    await tunnel.stop();
  };
  for (const signal of ["SIGINT", "SIGUSR1", "SIGUSR2"]) {
    process.once(signal, cleanup);
  }
  return {
    getURL: async () => await tunnel.url,
    close: async () => {
      await cleanup();
    }
  };
}

exports.startTunnel = startTunnel;
