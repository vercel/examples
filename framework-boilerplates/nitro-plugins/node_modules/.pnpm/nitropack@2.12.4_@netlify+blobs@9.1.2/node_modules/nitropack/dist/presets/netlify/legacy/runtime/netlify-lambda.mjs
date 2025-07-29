import "#nitro-internal-pollyfills";
import { useNitroApp } from "nitropack/runtime";
import {
  normalizeCookieHeader,
  normalizeLambdaIncomingHeaders,
  normalizeLambdaOutgoingBody,
  normalizeLambdaOutgoingHeaders
} from "nitropack/runtime/internal";
import { withQuery } from "ufo";
const nitroApp = useNitroApp();
export async function lambda(event, context) {
  const query = {
    ...event.queryStringParameters,
    ...event.multiValueQueryStringParameters
  };
  const url = withQuery(event.path, query);
  const method = event.httpMethod || "get";
  const r = await nitroApp.localCall({
    event,
    url,
    context,
    headers: normalizeLambdaIncomingHeaders(event.headers),
    method,
    query,
    body: event.isBase64Encoded ? Buffer.from(event.body || "", "base64") : event.body
  });
  const cookies = normalizeCookieHeader(String(r.headers["set-cookie"]));
  const awsBody = await normalizeLambdaOutgoingBody(r.body, r.headers);
  return {
    statusCode: r.status,
    headers: normalizeLambdaOutgoingHeaders(r.headers, true),
    body: awsBody.body,
    isBase64Encoded: awsBody.type === "binary",
    ...cookies.length > 0 && {
      multiValueHeaders: { "set-cookie": cookies }
    }
  };
}
