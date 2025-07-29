import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { joinURL } from "ufo";
export async function writeAmplifyFiles(nitro) {
  const outDir = nitro.options.output.dir;
  const routes = [];
  let hasWildcardPublicAsset = false;
  if (nitro.options.awsAmplify?.imageOptimization && !nitro.options.static) {
    const { path, cacheControl } = nitro.options.awsAmplify?.imageOptimization || {};
    if (path) {
      routes.push({
        path,
        target: {
          kind: "ImageOptimization",
          cacheControl
        }
      });
    }
  }
  const computeTarget = nitro.options.static ? { kind: "Static" } : { kind: "Compute", src: "default" };
  for (const publicAsset of nitro.options.publicAssets) {
    if (!publicAsset.baseURL || publicAsset.baseURL === "/") {
      hasWildcardPublicAsset = true;
      continue;
    }
    routes.push({
      path: `${publicAsset.baseURL.replace(/\/$/, "")}/*`,
      target: {
        kind: "Static",
        cacheControl: publicAsset.maxAge > 0 ? `public, max-age=${publicAsset.maxAge}, immutable` : void 0
      },
      fallback: publicAsset.fallthrough ? computeTarget : void 0
    });
  }
  if (hasWildcardPublicAsset && !nitro.options.static) {
    routes.push({
      path: "/*.*",
      target: {
        kind: "Static"
      },
      fallback: computeTarget
    });
  }
  routes.push({
    path: "/*",
    target: computeTarget,
    fallback: hasWildcardPublicAsset && nitro.options.awsAmplify?.catchAllStaticFallback ? {
      kind: "Static"
    } : void 0
  });
  for (const route of routes) {
    if (route.path !== "/*") {
      route.path = joinURL(nitro.options.baseURL, route.path);
    }
  }
  const deployManifest = {
    version: 1,
    routes,
    imageSettings: nitro.options.awsAmplify?.imageSettings || void 0,
    computeResources: nitro.options.static ? void 0 : [
      {
        name: "default",
        entrypoint: "server.js",
        runtime: nitro.options.awsAmplify?.runtime || "nodejs20.x"
      }
    ],
    framework: {
      name: nitro.options.framework.name || "nitro",
      version: nitro.options.framework.version || "0.0.0"
    }
  };
  await writeFile(
    resolve(outDir, "deploy-manifest.json"),
    JSON.stringify(deployManifest, null, 2)
  );
  if (!nitro.options.static) {
    await writeFile(
      resolve(outDir, "compute/default/server.js"),
      `import("./index.mjs")`
    );
  }
}
