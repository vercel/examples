import fsp from "node:fs/promises";
import { defu } from "defu";
import { writeFile } from "nitropack/kit";
import { dirname, relative, resolve } from "pathe";
import { joinURL, withoutLeadingSlash } from "ufo";
import { isTest } from "std-env";
const SUPPORTED_NODE_VERSIONS = [18, 20, 22];
function getSystemNodeVersion() {
  const systemNodeVersion = Number.parseInt(
    process.versions.node.split(".")[0]
  );
  return Number.isNaN(systemNodeVersion) ? 22 : systemNodeVersion;
}
export async function generateFunctionFiles(nitro) {
  const o11Routes = getObservabilityRoutes(nitro);
  const buildConfigPath = resolve(nitro.options.output.dir, "config.json");
  const buildConfig = generateBuildConfig(nitro, o11Routes);
  await writeFile(buildConfigPath, JSON.stringify(buildConfig, null, 2));
  const systemNodeVersion = getSystemNodeVersion();
  const usedNodeVersion = SUPPORTED_NODE_VERSIONS.find((version) => version >= systemNodeVersion) ?? SUPPORTED_NODE_VERSIONS.at(-1);
  const runtimeVersion = `nodejs${usedNodeVersion}.x`;
  const functionConfigPath = resolve(
    nitro.options.output.serverDir,
    ".vc-config.json"
  );
  const functionConfig = {
    runtime: runtimeVersion,
    handler: "index.mjs",
    launcherType: "Nodejs",
    shouldAddHelpers: false,
    supportsResponseStreaming: true,
    ...nitro.options.vercel?.functions
  };
  await writeFile(functionConfigPath, JSON.stringify(functionConfig, null, 2));
  for (const [key, value] of Object.entries(nitro.options.routeRules)) {
    if (!value.isr) {
      continue;
    }
    let isrConfig = value.isr;
    if (typeof isrConfig === "number") {
      isrConfig = { expiration: isrConfig };
    } else if (isrConfig === true) {
      isrConfig = { expiration: false };
    } else {
      isrConfig = { ...isrConfig };
    }
    const prerenderConfig = {
      expiration: isrConfig.expiration ?? false,
      bypassToken: nitro.options.vercel?.config?.bypassToken,
      ...isrConfig
    };
    if (key.includes("/**")) {
      isrConfig.allowQuery = isrConfig.allowQuery || [];
      if (!isrConfig.allowQuery.includes("url")) {
        isrConfig.allowQuery.push("url");
      }
    }
    const funcPrefix = resolve(
      nitro.options.output.serverDir,
      ".." + generateEndpoint(key)
    );
    await fsp.mkdir(dirname(funcPrefix), { recursive: true });
    await fsp.symlink(
      "./" + relative(dirname(funcPrefix), nitro.options.output.serverDir),
      funcPrefix + ".func",
      "junction"
    );
    await writeFile(
      funcPrefix + ".prerender-config.json",
      JSON.stringify(prerenderConfig, null, 2)
    );
  }
  for (const route of o11Routes) {
    const funcPrefix = resolve(
      nitro.options.output.serverDir,
      "..",
      route.dest
    );
    await fsp.mkdir(dirname(funcPrefix), { recursive: true });
    await fsp.symlink(
      "./" + relative(dirname(funcPrefix), nitro.options.output.serverDir),
      funcPrefix + ".func",
      "junction"
    );
  }
}
export async function generateEdgeFunctionFiles(nitro) {
  const buildConfigPath = resolve(nitro.options.output.dir, "config.json");
  const buildConfig = generateBuildConfig(nitro);
  await writeFile(buildConfigPath, JSON.stringify(buildConfig, null, 2));
  const functionConfigPath = resolve(
    nitro.options.output.serverDir,
    ".vc-config.json"
  );
  const functionConfig = {
    runtime: "edge",
    entrypoint: "index.mjs",
    regions: nitro.options.vercel?.regions
  };
  await writeFile(functionConfigPath, JSON.stringify(functionConfig, null, 2));
}
export async function generateStaticFiles(nitro) {
  const buildConfigPath = resolve(nitro.options.output.dir, "config.json");
  const buildConfig = generateBuildConfig(nitro);
  await writeFile(buildConfigPath, JSON.stringify(buildConfig, null, 2));
}
function generateBuildConfig(nitro, o11Routes) {
  const rules = Object.entries(nitro.options.routeRules).sort(
    (a, b) => b[0].split(/\/(?!\*)/).length - a[0].split(/\/(?!\*)/).length
  );
  const config = defu(nitro.options.vercel?.config, {
    version: 3,
    overrides: {
      // Nitro static prerendered route overrides
      ...Object.fromEntries(
        (nitro._prerenderedRoutes?.filter((r) => r.fileName !== r.route) || []).map(({ route, fileName }) => [
          withoutLeadingSlash(fileName),
          { path: route.replace(/^\//, "") }
        ])
      )
    },
    routes: [
      // Redirect and header rules
      ...rules.filter(([_, routeRules]) => routeRules.redirect || routeRules.headers).map(([path, routeRules]) => {
        let route = {
          src: path.replace("/**", "/(.*)")
        };
        if (routeRules.redirect) {
          route = defu(route, {
            status: routeRules.redirect.statusCode,
            headers: {
              Location: routeRules.redirect.to.replace("/**", "/$1")
            }
          });
        }
        if (routeRules.headers) {
          route = defu(route, { headers: routeRules.headers });
        }
        return route;
      }),
      // Public asset rules
      ...nitro.options.publicAssets.filter((asset) => !asset.fallthrough).map((asset) => joinURL(nitro.options.baseURL, asset.baseURL || "/")).map((baseURL) => ({
        src: baseURL + "(.*)",
        headers: {
          "cache-control": "public,max-age=31536000,immutable"
        },
        continue: true
      })),
      { handle: "filesystem" }
    ]
  });
  if (nitro.options.static) {
    return config;
  }
  config.routes.push(
    ...rules.filter(
      ([key, value]) => (
        // value.isr === false || (value.isr && key.includes("/**"))
        value.isr !== void 0 && key !== "/"
      )
    ).map(([key, value]) => {
      const src = key.replace(/^(.*)\/\*\*/, "(?<url>$1/.*)");
      if (value.isr === false) {
        return {
          src,
          dest: "/__nitro"
        };
      }
      return {
        src,
        dest: nitro.options.preset === "vercel-edge" ? "/__nitro?url=$url" : generateEndpoint(key) + "?url=$url"
      };
    }),
    ...nitro.options.routeRules["/"]?.isr ? [
      {
        src: "(?<url>/)",
        dest: "/__nitro-index?url=$url"
      }
    ] : [],
    ...(o11Routes || []).map((route) => ({
      src: route.src,
      dest: "/" + route.dest
    })),
    ...nitro.options.routeRules["/**"]?.isr ? [] : [
      {
        src: "/(.*)",
        dest: "/__nitro"
      }
    ]
  );
  return config;
}
function generateEndpoint(url) {
  if (url === "/") {
    return "/__nitro-index";
  }
  return url.includes("/**") ? "/__nitro-" + withoutLeadingSlash(url.replace(/\/\*\*.*/, "").replace(/[^a-z]/g, "-")) : url;
}
export function deprecateSWR(nitro) {
  if (nitro.options.future.nativeSWR) {
    return;
  }
  let hasLegacyOptions = false;
  for (const [key, value] of Object.entries(nitro.options.routeRules)) {
    if (_hasProp(value, "isr")) {
      continue;
    }
    if (value.cache === false) {
      value.isr = false;
    }
    if (_hasProp(value, "static")) {
      value.isr = !value.static;
      hasLegacyOptions = true;
    }
    if (value.cache && _hasProp(value.cache, "swr")) {
      value.isr = value.cache.swr;
      hasLegacyOptions = true;
    }
  }
  if (hasLegacyOptions && !isTest) {
    nitro.logger.warn(
      "Nitro now uses `isr` option to configure ISR behavior on Vercel. Backwards-compatible support for `static` and `swr` options within the Vercel Build Options API will be removed in the future versions. Set `future.nativeSWR: true` nitro config disable this warning."
    );
  }
}
function _hasProp(obj, prop) {
  return obj && typeof obj === "object" && prop in obj;
}
function getObservabilityRoutes(nitro) {
  const compatDate = nitro.options.compatibilityDate.vercel || nitro.options.compatibilityDate.default;
  if (compatDate < "2025-07-15") {
    return [];
  }
  const routePatterns = [
    .../* @__PURE__ */ new Set([
      ...nitro.options.ssrRoutes || [],
      ...[...nitro.scannedHandlers, ...nitro.options.handlers].filter((h) => !h.middleware && h.route).map((h) => h.route)
    ])
  ];
  const staticRoutes = [];
  const dynamicRoutes = [];
  const catchAllRoutes = [];
  for (const route of routePatterns) {
    if (route.includes("**")) {
      catchAllRoutes.push(route);
    } else if (route.includes(":") || route.includes("*")) {
      dynamicRoutes.push(route);
    } else {
      staticRoutes.push(route);
    }
  }
  return [
    ...normalizeRoutes(staticRoutes),
    ...normalizeRoutes(dynamicRoutes),
    ...normalizeRoutes(catchAllRoutes)
  ];
}
function normalizeRoutes(routes) {
  return routes.sort(
    (a, b) => (
      // a.split("/").length - b.split("/").length ||
      b.localeCompare(a)
    )
  ).map((route) => ({
    src: normalizeRouteSrc(route),
    dest: normalizeRouteDest(route)
  }));
}
function normalizeRouteSrc(route) {
  let idCtr = 0;
  return route.split("/").map((segment) => {
    if (segment.startsWith("**")) {
      return segment === "**" ? "(?:.*)" : `?(?<${namedGroup(segment.slice(3))}>.+)`;
    }
    if (segment === "*") {
      return `(?<_${idCtr++}>[^/]*)`;
    }
    if (segment.includes(":")) {
      return segment.replace(/:(\w+)/g, (_, id) => `(?<${namedGroup(id)}>[^/]+)`).replace(/\./g, String.raw`\.`);
    }
    return segment;
  }).join("/");
}
function namedGroup(input = "") {
  if (/\d/.test(input[0])) {
    input = `_${input}`;
  }
  return input.replace(/[^a-zA-Z0-9_]/g, "") || "_";
}
function normalizeRouteDest(route) {
  return route.split("/").slice(1).map((segment) => {
    if (segment.startsWith("**")) {
      return `[...${segment.replace(/[*:]/g, "")}]`;
    }
    if (segment === "*") {
      return "[-]";
    }
    if (segment.startsWith(":")) {
      return `[${segment.slice(1)}]`;
    }
    if (segment.includes(":")) {
      return `[${segment.replace(/:/g, "_")}]`;
    }
    return segment;
  }).map((segment) => segment.replace(/[^a-zA-Z0-9_.[\]]/g, "-")).join("/") || "index";
}
