import { existsSync, promises as fsp } from "node:fs";
import { join } from "pathe";
import { joinURL } from "ufo";
export async function writeRedirects(nitro) {
  const redirectsPath = join(nitro.options.output.publicDir, "_redirects");
  let contents = "";
  if (nitro.options.static) {
    const staticFallback = existsSync(
      join(nitro.options.output.publicDir, "404.html")
    ) ? "/* /404.html 404" : "";
    contents += staticFallback;
  }
  const rules = Object.entries(nitro.options.routeRules).sort(
    (a, b) => a[0].split(/\/(?!\*)/).length - b[0].split(/\/(?!\*)/).length
  );
  for (const [key, routeRules] of rules.filter(
    ([_, routeRules2]) => routeRules2.redirect
  )) {
    let code = routeRules.redirect.statusCode;
    if (code === 307) {
      code = 302;
    }
    if (code === 308) {
      code = 301;
    }
    contents = `${key.replace("/**", "/*")}	${routeRules.redirect.to.replace(
      "/**",
      "/:splat"
    )}	${code}
` + contents;
  }
  if (existsSync(redirectsPath)) {
    const currentRedirects = await fsp.readFile(redirectsPath, "utf8");
    if (/^\/\* /m.test(currentRedirects)) {
      nitro.logger.info(
        "Not adding Nitro fallback to `_redirects` (as an existing fallback was found)."
      );
      return;
    }
    nitro.logger.info(
      "Adding Nitro fallback to `_redirects` to handle all unmatched routes."
    );
    contents = currentRedirects + "\n" + contents;
  }
  await fsp.writeFile(redirectsPath, contents);
}
export async function writeHeaders(nitro) {
  const headersPath = join(nitro.options.output.publicDir, "_headers");
  let contents = "";
  const rules = Object.entries(nitro.options.routeRules).sort(
    (a, b) => b[0].split(/\/(?!\*)/).length - a[0].split(/\/(?!\*)/).length
  );
  for (const [path, routeRules] of rules.filter(
    ([_, routeRules2]) => routeRules2.headers
  )) {
    const headers = [
      path.replace("/**", "/*"),
      ...Object.entries({ ...routeRules.headers }).map(
        ([header, value]) => `  ${header}: ${value}`
      )
    ].join("\n");
    contents += headers + "\n";
  }
  if (existsSync(headersPath)) {
    const currentHeaders = await fsp.readFile(headersPath, "utf8");
    if (/^\/\* /m.test(currentHeaders)) {
      nitro.logger.info(
        "Not adding Nitro fallback to `_headers` (as an existing fallback was found)."
      );
      return;
    }
    nitro.logger.info(
      "Adding Nitro fallback to `_headers` to handle all unmatched routes."
    );
    contents = currentHeaders + "\n" + contents;
  }
  await fsp.writeFile(headersPath, contents);
}
export function getStaticPaths(publicAssets, baseURL) {
  return [
    "/.netlify/*",
    // TODO: should this be also be prefixed with baseURL?
    ...publicAssets.filter((a) => a.fallthrough !== true && a.baseURL && a.baseURL !== "/").map((a) => joinURL(baseURL, a.baseURL, "*"))
  ];
}
export function generateNetlifyFunction(nitro) {
  return (
    /* js */
    `
export { default } from "./main.mjs";
export const config = {
  name: "server handler",
  generator: "${getGeneratorString(nitro)}",
  path: "/*",
  nodeBundler: "none",
  includedFiles: ["**"],
  excludedPath: ${JSON.stringify(getStaticPaths(nitro.options.publicAssets, nitro.options.baseURL))},
  preferStatic: true,
};
    `.trim()
  );
}
export function getGeneratorString(nitro) {
  return `${nitro.options.framework.name}@${nitro.options.framework.version}`;
}
