import { resolve } from "node:path";
import { promises as fs } from "node:fs";
import { fileURLToPath } from "mlly";
import { findFile } from "pkg-types";
import { resolveModulePath } from "exsolve";
export async function cloudflareDev(nitro) {
  if (!nitro.options.dev) {
    return;
  }
  const wranglerPath = await resolveModulePath("wrangler", {
    from: nitro.options.nodeModulesDirs,
    try: true
  });
  if (!wranglerPath) {
    nitro.logger.warn(
      "Wrangler is not installed. Please install it using `npx nypm i wrangler` to enable dev emulation."
    );
    return;
  }
  const config = {
    // compatibility with legacy nitro-cloudflare-dev module
    ...nitro.options.cloudflareDev,
    ...nitro.options.cloudflare?.dev
  };
  let configPath = config.configPath;
  if (!configPath) {
    configPath = await findFile(
      ["wrangler.json", "wrangler.jsonc", "wrangler.toml"],
      {
        startingFrom: nitro.options.srcDir
      }
    ).catch(() => void 0);
  }
  const persistDir = resolve(
    nitro.options.rootDir,
    config.persistDir || ".wrangler/state/v3"
  );
  const gitIgnorePath = await findFile(".gitignore", {
    startingFrom: nitro.options.rootDir
  }).catch(() => void 0);
  let addedToGitIgnore = false;
  if (gitIgnorePath && persistDir === ".wrangler/state/v3") {
    const gitIgnore = await fs.readFile(gitIgnorePath, "utf8");
    if (!gitIgnore.includes(".wrangler/state/v3")) {
      await fs.writeFile(gitIgnorePath, gitIgnore + "\n.wrangler/state/v3\n").catch(() => {
      });
      addedToGitIgnore = true;
    }
  }
  nitro.options.runtimeConfig.wrangler = {
    ...nitro.options.runtimeConfig.wrangler,
    configPath,
    persistDir,
    environment: config.environment
  };
  nitro.options.externals.inline = nitro.options.externals.inline || [];
  nitro.options.externals.inline.push(
    fileURLToPath(new URL("runtime/", import.meta.url))
  );
  nitro.options.plugins = nitro.options.plugins || [];
  nitro.options.plugins.push(
    fileURLToPath(new URL("runtime/plugin.dev", import.meta.url))
  );
}
