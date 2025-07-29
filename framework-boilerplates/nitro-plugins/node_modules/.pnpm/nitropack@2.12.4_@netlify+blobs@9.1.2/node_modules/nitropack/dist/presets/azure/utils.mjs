import { createWriteStream } from "node:fs";
import fsp from "node:fs/promises";
import archiver from "archiver";
import { writeFile } from "nitropack/kit";
import { join, resolve } from "pathe";
export async function writeFunctionsRoutes(nitro) {
  const host = {
    version: "2.0",
    extensions: { http: { routePrefix: "" } }
  };
  const functionDefinition = {
    entryPoint: "handle",
    bindings: [
      {
        authLevel: "anonymous",
        type: "httpTrigger",
        direction: "in",
        name: "req",
        route: "{*url}",
        methods: ["delete", "get", "head", "options", "patch", "post", "put"]
      },
      {
        type: "http",
        direction: "out",
        name: "res"
      }
    ]
  };
  await writeFile(
    resolve(nitro.options.output.serverDir, "function.json"),
    JSON.stringify(functionDefinition)
  );
  await writeFile(
    resolve(nitro.options.output.dir, "host.json"),
    JSON.stringify(host)
  );
  await _zipDirectory(
    nitro.options.output.dir,
    join(nitro.options.output.dir, "deploy.zip")
  );
}
export async function writeSWARoutes(nitro) {
  const host = {
    version: "2.0"
  };
  const supportedNodeVersions = /* @__PURE__ */ new Set(["16", "18", "20"]);
  let nodeVersion = "18";
  try {
    const currentNodeVersion = JSON.parse(
      await fsp.readFile(join(nitro.options.rootDir, "package.json"), "utf8")
    ).engines.node;
    if (supportedNodeVersions.has(currentNodeVersion)) {
      nodeVersion = currentNodeVersion;
    }
  } catch {
    const currentNodeVersion = process.versions.node.slice(0, 2);
    if (supportedNodeVersions.has(currentNodeVersion)) {
      nodeVersion = currentNodeVersion;
    }
  }
  const config = {
    ...nitro.options.azure?.config,
    // Overwrite routes for now, we will add existing routes after generating routes
    routes: [],
    platform: {
      apiRuntime: `node:${nodeVersion}`,
      ...nitro.options.azure?.config?.platform
    },
    navigationFallback: {
      rewrite: "/api/server",
      ...nitro.options.azure?.config?.navigationFallback
    }
  };
  const routeFiles = nitro._prerenderedRoutes || [];
  const indexFileExists = routeFiles.some(
    (route) => route.fileName === "/index.html"
  );
  if (!indexFileExists) {
    config.routes.unshift(
      {
        route: "/index.html",
        redirect: "/"
      },
      {
        route: "/",
        rewrite: "/api/server"
      }
    );
  }
  const suffix = "/index.html".length;
  for (const { fileName } of routeFiles) {
    if (!fileName || !fileName.endsWith("/index.html")) {
      continue;
    }
    config.routes.unshift({
      route: fileName.slice(0, -suffix) || "/",
      rewrite: fileName
    });
  }
  for (const { fileName } of routeFiles) {
    if (!fileName || !fileName.endsWith(".html") || fileName.endsWith("index.html")) {
      continue;
    }
    const route = fileName.slice(0, -".html".length);
    const existingRouteIndex = config.routes.findIndex(
      (_route) => _route.route === route
    );
    if (existingRouteIndex !== -1) {
      config.routes.splice(existingRouteIndex, 1);
    }
    config.routes.unshift({
      route,
      rewrite: fileName
    });
  }
  if (nitro.options.azure?.config && "routes" in nitro.options.azure.config && Array.isArray(nitro.options.azure.config.routes)) {
    for (const customRoute of nitro.options.azure.config.routes.reverse()) {
      const existingRouteMatchIndex = config.routes.findIndex(
        (value) => value.route === customRoute.route
      );
      if (existingRouteMatchIndex === -1) {
        config.routes.unshift(customRoute);
      } else {
        config.routes[existingRouteMatchIndex] = customRoute;
      }
    }
  }
  const functionDefinition = {
    entryPoint: "handle",
    bindings: [
      {
        authLevel: "anonymous",
        type: "httpTrigger",
        direction: "in",
        name: "req",
        route: "{*url}",
        methods: ["delete", "get", "head", "options", "patch", "post", "put"]
      },
      {
        type: "http",
        direction: "out",
        name: "res"
      }
    ]
  };
  await writeFile(
    resolve(nitro.options.output.serverDir, "function.json"),
    JSON.stringify(functionDefinition, null, 2)
  );
  await writeFile(
    resolve(nitro.options.output.serverDir, "../host.json"),
    JSON.stringify(host, null, 2)
  );
  const stubPackageJson = resolve(
    nitro.options.output.serverDir,
    "../package.json"
  );
  await writeFile(stubPackageJson, JSON.stringify({ private: true }));
  await writeFile(
    resolve(nitro.options.rootDir, "staticwebapp.config.json"),
    JSON.stringify(config, null, 2)
  );
  if (!indexFileExists) {
    const baseURLSegments = nitro.options.baseURL.split("/").filter(Boolean);
    const relativePrefix = baseURLSegments.map(() => "..").join("/");
    await writeFile(
      resolve(
        nitro.options.output.publicDir,
        relativePrefix ? `${relativePrefix}/index.html` : "index.html"
      ),
      ""
    );
  }
}
function _zipDirectory(dir, outfile) {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = createWriteStream(outfile);
  return new Promise((resolve2, reject) => {
    archive.glob("**/*", { cwd: dir, nodir: true, dot: true, follow: true }).on("error", (err) => reject(err)).pipe(stream);
    stream.on("close", () => resolve2(void 0));
    archive.finalize();
  });
}
