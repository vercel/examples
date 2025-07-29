import "#nitro-internal-pollyfills";
import { useNitroApp } from "nitropack/runtime";
import {
  getAzureParsedCookiesFromHeaders,
  normalizeLambdaOutgoingHeaders
} from "nitropack/runtime/internal";
import { parseURL } from "ufo";
const nitroApp = useNitroApp();
export async function handle(context, req) {
  let url;
  if (req.headers["x-ms-original-url"]) {
    const parsedURL = parseURL(req.headers["x-ms-original-url"]);
    url = parsedURL.pathname + parsedURL.search;
  } else {
    url = "/api/" + (req.params.url || "");
  }
  const { body, status, headers } = await nitroApp.localCall({
    url,
    headers: req.headers,
    method: req.method || void 0,
    // https://github.com/Azure/azure-functions-nodejs-worker/issues/294
    // https://github.com/Azure/azure-functions-host/issues/293
    body: req.bufferBody ?? req.rawBody
  });
  context.res = {
    status,
    cookies: getAzureParsedCookiesFromHeaders(headers),
    headers: normalizeLambdaOutgoingHeaders(headers, true),
    body
  };
}
