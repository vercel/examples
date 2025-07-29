import "#nitro-internal-pollyfills";
import { useNitroApp } from "nitropack/runtime";
import {
  getAzureParsedCookiesFromHeaders,
  normalizeLambdaOutgoingHeaders
} from "nitropack/runtime/internal";
const nitroApp = useNitroApp();
export async function handle(context, req) {
  const url = "/" + (req.params.url || "");
  const { body, status, statusText, headers } = await nitroApp.localCall({
    url,
    headers: req.headers,
    method: req.method || void 0,
    // https://github.com/Azure/azure-functions-host/issues/293
    body: req.rawBody
  });
  context.res = {
    status,
    // cookies https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node?tabs=typescript%2Cwindows%2Cazure-cli&pivots=nodejs-model-v4#http-response
    cookies: getAzureParsedCookiesFromHeaders(headers),
    headers: normalizeLambdaOutgoingHeaders(headers, true),
    body: body ?? statusText
  };
}
