import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { relative, dirname, extname } from "node:path";
import { writeFile } from "nitropack/kit";
import { parseTOML, parseJSONC } from "confbox";
import { readGitConfig, readPackageJSON, findNearestFile } from "pkg-types";
import { defu } from "defu";
import { globby } from "globby";
import { provider } from "std-env";
import { join, resolve } from "pathe";
import {
  joinURL,
  hasProtocol,
  withLeadingSlash,
  withTrailingSlash,
  withoutLeadingSlash
} from "ufo";
import {
  workerdHybridNodeCompatPlugin,
  unenvWorkerdWithNodeCompat
} from "../_unenv/preset-workerd.mjs";
export async function writeCFRoutes(nitro) {
  const _cfPagesConfig = nitro.options.cloudflare?.pages || {};
  const routes = {
    version: _cfPagesConfig.routes?.version || 1,
    include: _cfPagesConfig.routes?.include || ["/*"],
    exclude: _cfPagesConfig.routes?.exclude || []
  };
  const writeRoutes = () => writeFile(
    resolve(nitro.options.output.dir, "_routes.json"),
    JSON.stringify(routes, void 0, 2),
    true
  );
  if (_cfPagesConfig.defaultRoutes === false) {
    await writeRoutes();
    return;
  }
  const explicitPublicAssets = nitro.options.publicAssets.filter(
    (dir, index, array) => {
      if (dir.fallthrough || !dir.baseURL) {
        return false;
      }
      const normalizedBase = withoutLeadingSlash(dir.baseURL);
      return !array.some(
        (otherDir, otherIndex) => otherIndex !== index && normalizedBase.startsWith(
          withoutLeadingSlash(withTrailingSlash(otherDir.baseURL))
        )
      );
    }
  );
  routes.exclude.push(
    ...explicitPublicAssets.map((asset) => joinURL(nitro.options.baseURL, asset.baseURL || "/", "*")).sort(comparePaths)
  );
  const publicAssetFiles = await globby("**", {
    cwd: nitro.options.output.dir,
    absolute: false,
    dot: true,
    ignore: [
      "_worker.js",
      "_worker.js.map",
      "nitro.json",
      ...routes.exclude.map(
        (path) => withoutLeadingSlash(path.replace(/\/\*$/, "/**"))
      )
    ]
  });
  routes.exclude.push(
    ...publicAssetFiles.map(
      (i) => withLeadingSlash(i).replace(/\/index\.html$/, "").replace(/\.html$/, "") || "/"
    ).sort(comparePaths)
  );
  routes.exclude.splice(100 - routes.include.length);
  await writeRoutes();
}
function comparePaths(a, b) {
  return a.split("/").length - b.split("/").length || a.localeCompare(b);
}
export async function writeCFHeaders(nitro) {
  const headersPath = join(nitro.options.output.dir, "_headers");
  const contents = [];
  const rules = Object.entries(nitro.options.routeRules).sort(
    (a, b) => b[0].split(/\/(?!\*)/).length - a[0].split(/\/(?!\*)/).length
  );
  for (const [path, routeRules] of rules.filter(
    ([_, routeRules2]) => routeRules2.headers
  )) {
    const headers = [
      joinURL(nitro.options.baseURL, path.replace("/**", "/*")),
      ...Object.entries({ ...routeRules.headers }).map(
        ([header, value]) => `  ${header}: ${value}`
      )
    ].join("\n");
    contents.push(headers);
  }
  if (existsSync(headersPath)) {
    const currentHeaders = await readFile(headersPath, "utf8");
    if (/^\/\* /m.test(currentHeaders)) {
      nitro.logger.info(
        "Not adding Nitro fallback to `_headers` (as an existing fallback was found)."
      );
      return;
    }
    nitro.logger.info(
      "Adding Nitro fallback to `_headers` to handle all unmatched routes."
    );
    contents.unshift(currentHeaders);
  }
  await writeFile(headersPath, contents.join("\n"), true);
}
export async function writeCFPagesRedirects(nitro) {
  const redirectsPath = join(nitro.options.output.dir, "_redirects");
  const staticFallback = existsSync(
    join(nitro.options.output.publicDir, "404.html")
  ) ? `${joinURL(nitro.options.baseURL, "/*")} ${joinURL(nitro.options.baseURL, "/404.html")} 404` : "";
  const contents = [staticFallback];
  const rules = Object.entries(nitro.options.routeRules).sort(
    (a, b) => a[0].split(/\/(?!\*)/).length - b[0].split(/\/(?!\*)/).length
  );
  for (const [key, routeRules] of rules.filter(
    ([_, routeRules2]) => routeRules2.redirect
  )) {
    const code = routeRules.redirect.statusCode;
    const from = joinURL(nitro.options.baseURL, key.replace("/**", "/*"));
    const to = hasProtocol(routeRules.redirect.to, { acceptRelative: true }) ? routeRules.redirect.to : joinURL(nitro.options.baseURL, routeRules.redirect.to);
    contents.unshift(`${from}	${to}	${code}`);
  }
  if (existsSync(redirectsPath)) {
    const currentRedirects = await readFile(redirectsPath, "utf8");
    if (/^\/\* /m.test(currentRedirects)) {
      nitro.logger.info(
        "Not adding Nitro fallback to `_redirects` (as an existing fallback was found)."
      );
      return;
    }
    nitro.logger.info(
      "Adding Nitro fallback to `_redirects` to handle all unmatched routes."
    );
    contents.unshift(currentRedirects);
  }
  await writeFile(redirectsPath, contents.join("\n"), true);
}
export async function enableNodeCompat(nitro) {
  nitro.options.cloudflare ??= {};
  if (nitro.options.cloudflare.deployConfig === void 0 && provider === "cloudflare_workers") {
    nitro.options.cloudflare.deployConfig = true;
  }
  if (nitro.options.cloudflare.nodeCompat === void 0) {
    const { config } = await readWranglerConfig(nitro);
    const userCompatibilityFlags = new Set(config?.compatibility_flags || []);
    if (userCompatibilityFlags.has("nodejs_compat") || userCompatibilityFlags.has("nodejs_compat_v2") || nitro.options.cloudflare.deployConfig) {
      nitro.options.cloudflare.nodeCompat = true;
    }
  }
  if (!nitro.options.cloudflare.nodeCompat) {
    if (nitro.options.cloudflare.nodeCompat === void 0) {
      nitro.logger.warn("[cloudflare] Node.js compatibility is not enabled.");
    }
    return;
  }
  nitro.options.unenv.push(unenvWorkerdWithNodeCompat);
  nitro.options.rollupConfig.plugins ??= [];
  nitro.options.rollupConfig.plugins.push(
    workerdHybridNodeCompatPlugin
  );
}
const extensionParsers = {
  ".json": JSON.parse,
  ".jsonc": parseJSONC,
  ".toml": parseTOML
};
async function readWranglerConfig(nitro) {
  const configPath = await findNearestFile(
    ["wrangler.json", "wrangler.jsonc", "wrangler.toml"],
    {
      startingFrom: nitro.options.rootDir
    }
  ).catch(() => void 0);
  if (!configPath) {
    return {};
  }
  const userConfigText = await readFile(configPath, "utf8");
  const parser = extensionParsers[extname(configPath)];
  if (!parser) {
    throw new Error(`Unsupported config file format: ${configPath}`);
  }
  const config = parser(userConfigText);
  return { configPath, config };
}
export async function writeWranglerConfig(nitro, cfTarget) {
  if (!nitro.options.cloudflare?.deployConfig) {
    return;
  }
  const wranglerConfigDir = nitro.options.output.serverDir;
  const wranglerConfigPath = join(wranglerConfigDir, "wrangler.json");
  const defaults = {};
  const overrides = {};
  defaults.compatibility_date = nitro.options.compatibilityDate.cloudflare || nitro.options.compatibilityDate.default;
  if (cfTarget === "pages") {
    overrides.pages_build_output_dir = relative(
      wranglerConfigDir,
      nitro.options.output.dir
    );
  } else {
    overrides.main = relative(
      wranglerConfigDir,
      join(nitro.options.output.serverDir, "index.mjs")
    );
    overrides.assets = {
      binding: "ASSETS",
      directory: relative(
        wranglerConfigDir,
        resolve(
          nitro.options.output.publicDir,
          "..".repeat(nitro.options.baseURL.split("/").filter(Boolean).length)
        )
      )
    };
  }
  const { config: userConfig = {} } = await readWranglerConfig(nitro);
  const ctxConfig = nitro.options.cloudflare?.wrangler || {};
  for (const key in overrides) {
    if (key in userConfig || key in ctxConfig) {
      nitro.logger.warn(
        `[cloudflare] Wrangler config \`${key}\`${key in ctxConfig ? "set by config or modules" : ""} is overridden and will be ignored.`
      );
    }
  }
  const wranglerConfig = defu(
    overrides,
    ctxConfig,
    userConfig,
    defaults
  );
  if (!wranglerConfig.name) {
    wranglerConfig.name = await generateWorkerName(nitro);
    nitro.logger.info(
      `Using auto generated worker name: \`${wranglerConfig.name}\``
    );
  }
  const compatFlags = new Set(wranglerConfig.compatibility_flags || []);
  if (nitro.options.cloudflare?.nodeCompat) {
    if (compatFlags.has("nodejs_compat_v2") && compatFlags.has("no_nodejs_compat_v2")) {
      nitro.logger.warn(
        "[cloudflare] Wrangler config `compatibility_flags` contains both `nodejs_compat_v2` and `no_nodejs_compat_v2`. Ignoring `nodejs_compat_v2`."
      );
      compatFlags.delete("nodejs_compat_v2");
    }
    if (compatFlags.has("nodejs_compat_v2")) {
      nitro.logger.warn(
        "[cloudflare] Please consider replacing `nodejs_compat_v2` with `nodejs_compat` in your `compatibility_flags` or USE IT AT YOUR OWN RISK as it can cause issues with nitro."
      );
    } else {
      compatFlags.add("nodejs_compat");
      compatFlags.add("no_nodejs_compat_v2");
    }
  }
  wranglerConfig.compatibility_flags = [...compatFlags];
  await writeFile(
    wranglerConfigPath,
    JSON.stringify(wranglerConfig, null, 2),
    true
  );
  const configPath = join(
    nitro.options.rootDir,
    ".wrangler/deploy/config.json"
  );
  await writeFile(
    configPath,
    JSON.stringify({
      configPath: relative(dirname(configPath), wranglerConfigPath)
    }),
    true
  );
}
async function generateWorkerName(nitro) {
  const gitConfig = await readGitConfig(nitro.options.rootDir).catch(
    () => void 0
  );
  const gitRepo = gitConfig?.remote?.origin?.url?.replace(/\.git$/, "").match(/[/:]([^/]+\/[^/]+)$/)?.[1];
  const pkgJSON = await readPackageJSON(nitro.options.rootDir).catch(
    () => void 0
  );
  const pkgName = pkgJSON?.name;
  const subpath = relative(nitro.options.workspaceDir, nitro.options.rootDir);
  return `${gitRepo || pkgName}/${subpath}`.toLowerCase().replace(/[^a-zA-Z0-9-]/g, "-").replace(/-$/, "");
}
