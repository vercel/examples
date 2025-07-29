import "#nitro-internal-pollyfills";
import { getRouteRulesForPath } from "nitropack/runtime/internal";
import { withQuery } from "ufo";
import { lambda } from "./netlify-lambda.mjs";
export const handler = async function handler2(event, context) {
  const query = {
    ...event.queryStringParameters,
    ...event.multiValueQueryStringParameters
  };
  const url = withQuery(event.path, query);
  const routeRules = getRouteRulesForPath(url);
  if (routeRules.isr) {
    const builder = await import("@netlify/functions").then(
      (r) => r.builder || r.default.builder
    );
    const ttl = typeof routeRules.isr === "number" ? routeRules.isr : false;
    const builderHandler = ttl ? (event2, context2) => lambda(event2, context2).then((r) => ({ ...r, ttl })) : lambda;
    return builder(builderHandler)(event, context);
  }
  return lambda(event, context);
};
