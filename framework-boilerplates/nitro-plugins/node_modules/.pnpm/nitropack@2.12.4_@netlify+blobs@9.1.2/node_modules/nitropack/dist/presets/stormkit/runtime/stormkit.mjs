import "#nitro-internal-pollyfills";
import { useNitroApp } from "nitropack/runtime";
import { normalizeLambdaOutgoingBody } from "nitropack/runtime/internal";
const nitroApp = useNitroApp();
export const handler = async function(event, context) {
  const response = await nitroApp.localCall({
    event,
    url: event.url,
    context,
    headers: event.headers,
    method: event.method || "GET",
    query: event.query,
    body: event.body
  });
  const awsBody = await normalizeLambdaOutgoingBody(
    response.body,
    response.headers
  );
  return {
    statusCode: response.status,
    headers: normalizeOutgoingHeaders(response.headers),
    [awsBody.type === "text" ? "body" : "buffer"]: awsBody.body
  };
};
function normalizeOutgoingHeaders(headers) {
  return Object.fromEntries(
    Object.entries(headers).map(([k, v]) => [
      k,
      Array.isArray(v) ? v.join(",") : String(v)
    ])
  );
}
