import { toBuffer } from "./utils.mjs";
export function normalizeLambdaIncomingHeaders(headers) {
  return Object.fromEntries(
    Object.entries(headers || {}).map(([key, value]) => [
      key.toLowerCase(),
      value
    ])
  );
}
export function normalizeLambdaOutgoingHeaders(headers, stripCookies = false) {
  const entries = stripCookies ? Object.entries(headers).filter(([key]) => !["set-cookie"].includes(key)) : Object.entries(headers);
  return Object.fromEntries(
    entries.map(([k, v]) => [k, Array.isArray(v) ? v.join(",") : String(v)])
  );
}
export async function normalizeLambdaOutgoingBody(body, headers) {
  if (typeof body === "string") {
    return { type: "text", body };
  }
  if (!body) {
    return { type: "text", body: "" };
  }
  const buffer = await toBuffer(body);
  const contentType = headers["content-type"] || "";
  return isTextType(contentType) ? { type: "text", body: buffer.toString("utf8") } : { type: "binary", body: buffer.toString("base64") };
}
const TEXT_TYPE_RE = /^text\/|\/(javascript|json|xml)|utf-?8/;
function isTextType(contentType = "") {
  return TEXT_TYPE_RE.test(contentType);
}
