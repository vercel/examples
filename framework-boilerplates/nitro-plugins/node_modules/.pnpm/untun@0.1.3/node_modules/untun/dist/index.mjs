import { existsSync } from 'node:fs';
import consola from 'consola';

async function startTunnel(opts) {
  const {
    installCloudflared,
    startCloudflaredTunnel,
    cloudflaredBinPath,
    cloudflaredNotice
  } = await import('./chunks/index.mjs');
  const url = opts.url || `${opts.protocol || "http"}://${opts.hostname ?? "localhost"}:${opts.port ?? 3e3}`;
  consola.start(`Starting cloudflared tunnel to ${url}`);
  if (!existsSync(cloudflaredBinPath)) {
    consola.log(cloudflaredNotice);
    const canInstall = opts.acceptCloudflareNotice || process.env.UNTUN_ACCEPT_CLOUDFLARE_NOTICE || await consola.prompt(
      `Do you agree with the above terms and wish to install the binary from GitHub?`,
      {
        type: "confirm"
      }
    );
    if (!canInstall) {
      consola.fail("Skipping tunnel setup.");
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

export { startTunnel };
