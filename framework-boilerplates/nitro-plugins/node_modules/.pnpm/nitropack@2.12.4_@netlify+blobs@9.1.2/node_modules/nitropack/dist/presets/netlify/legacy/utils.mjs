import { existsSync, promises as fsp } from "node:fs";
import { join } from "pathe";
import { joinURL } from "ufo";
import { isTest } from "std-env";
export function generateCatchAllRedirects(publicAssets, catchAllPath) {
  if (!catchAllPath) return "";
  return [
    // e.g.: /static/* /static/:splat 200
    // Because of Netlify CDN shadowing
    // (https://docs.netlify.com/routing/redirects/rewrites-proxies/#shadowing),
    // this config avoids function invocations for all static paths, even 404s.
    ...getStaticPaths(publicAssets).map(
      (path) => `${path} ${path.replace("/*", "/:splat")} 200`
    ),
    `/* ${catchAllPath} 200`
  ].join("\n");
}
export async function writeRedirects(nitro, catchAllPath) {
  const redirectsPath = join(nitro.options.output.publicDir, "_redirects");
  const staticFallback = existsSync(
    join(nitro.options.output.publicDir, "404.html")
  ) ? "/* /404.html 404" : "";
  let contents = nitro.options.static ? staticFallback : generateCatchAllRedirects(nitro.options.publicAssets, catchAllPath);
  const rules = Object.entries(nitro.options.routeRules).sort(
    (a, b) => a[0].split(/\/(?!\*)/).length - b[0].split(/\/(?!\*)/).length
  );
  if (!nitro.options.static) {
    for (const [key, value] of rules.filter(
      ([_, value2]) => value2.isr !== void 0
    )) {
      contents = value.isr ? `${key.replace("/**", "/*")}	/.netlify/builders/server 200
` + contents : `${key.replace("/**", "/*")}	/.netlify/functions/server 200
` + contents;
    }
  }
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
export function getStaticPaths(publicAssets) {
  return publicAssets.filter(
    (dir) => dir.fallthrough !== true && dir.baseURL && dir.baseURL !== "/"
  ).map((dir) => joinURL("/", dir.baseURL, "*"));
}
export function deprecateSWR(nitro) {
  if (nitro.options.future.nativeSWR) {
    return;
  }
  let hasLegacyOptions = false;
  for (const [_key, value] of Object.entries(nitro.options.routeRules)) {
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
    if (value?.cache && _hasProp(value.cache, "swr")) {
      value.isr = value.cache.swr;
      hasLegacyOptions = true;
    }
  }
  if (hasLegacyOptions && !isTest) {
    nitro.logger.warn(
      "Nitro now uses `isr` option to configure ISR behavior on Netlify. Backwards-compatible support for `static` and `swr` support with Builder Functions will be removed in the future versions. Set `future.nativeSWR: true` nitro config disable this warning."
    );
  }
}
function _hasProp(obj, prop) {
  return obj && typeof obj === "object" && prop in obj;
}
