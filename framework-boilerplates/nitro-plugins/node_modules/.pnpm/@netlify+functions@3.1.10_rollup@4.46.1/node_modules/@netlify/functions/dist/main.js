// src/lib/consts.ts
var BUILDER_FUNCTIONS_FLAG = true;
var HTTP_STATUS_METHOD_NOT_ALLOWED = 405;
var METADATA_VERSION = 1;

// src/lib/builder.ts
var augmentResponse = (response) => {
  if (!response) {
    return response;
  }
  const metadata = { version: METADATA_VERSION, builder_function: BUILDER_FUNCTIONS_FLAG, ttl: response.ttl || 0 };
  return {
    ...response,
    metadata
  };
};
var wrapHandler = (handler) => (
  // eslint-disable-next-line promise/prefer-await-to-callbacks
  (event, context, callback) => {
    if (event.httpMethod !== "GET" && event.httpMethod !== "HEAD") {
      return Promise.resolve({
        body: "Method Not Allowed",
        statusCode: HTTP_STATUS_METHOD_NOT_ALLOWED
      });
    }
    const modifiedEvent = {
      ...event,
      multiValueQueryStringParameters: {},
      queryStringParameters: {}
    };
    const wrappedCallback = (error, response) => (
      // eslint-disable-next-line promise/prefer-await-to-callbacks
      callback ? callback(error, augmentResponse(response)) : null
    );
    const execution = handler(modifiedEvent, context, wrappedCallback);
    if (typeof execution === "object" && typeof execution.then === "function") {
      return execution.then(augmentResponse);
    }
    return execution;
  }
);

// src/lib/purge_cache.ts
import { env } from "process";
var purgeCache = async (options = {}) => {
  if (globalThis.fetch === void 0) {
    throw new Error(
      "`fetch` is not available. Please ensure you're using Node.js version 18.0.0 or above. Refer to https://ntl.fyi/functions-runtime for more information."
    );
  }
  const payload = {
    cache_tags: options.tags,
    deploy_alias: options.deployAlias
  };
  const token = env.NETLIFY_PURGE_API_TOKEN || options.token;
  if (env.NETLIFY_LOCAL && !token) {
    const scope = options.tags?.length ? ` for tags ${options.tags?.join(", ")}` : "";
    console.log(`Skipping purgeCache${scope} in local development.`);
    return;
  }
  if ("siteSlug" in options) {
    payload.site_slug = options.siteSlug;
  } else if ("domain" in options) {
    payload.domain = options.domain;
  } else {
    const siteID = options.siteID || env.SITE_ID;
    if (!siteID) {
      throw new Error(
        "The Netlify site ID was not found in the execution environment. Please supply it manually using the `siteID` property."
      );
    }
    payload.site_id = siteID;
  }
  if (!token) {
    throw new Error(
      "The cache purge API token was not found in the execution environment. Please supply it manually using the `token` property."
    );
  }
  const headers = {
    "Content-Type": "application/json; charset=utf8",
    Authorization: `Bearer ${token}`
  };
  if (options.userAgent) {
    headers["user-agent"] = options.userAgent;
  }
  const apiURL = options.apiURL || "https://api.netlify.com";
  const response = await fetch(`${apiURL}/api/v1/purge`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error(`Cache purge API call returned an unexpected status code: ${response.status}`);
  }
};

// src/lib/schedule.ts
var schedule = (cron, handler) => handler;

// src/lib/stream.ts
import { pipeline as pipelineSync } from "node:stream";
import { promisify } from "node:util";
var pipeline = promisify(pipelineSync);
var stream = (handler) => awslambda.streamifyResponse(async (event, responseStream, context) => {
  const { body, ...httpResponseMetadata } = await handler(event, context);
  const responseBody = awslambda.HttpResponseStream.from(responseStream, httpResponseMetadata);
  if (typeof body === "undefined") {
    responseBody.end();
  } else if (typeof body === "string") {
    responseBody.write(body);
    responseBody.end();
  } else {
    await pipeline(body, responseBody);
  }
});
export {
  wrapHandler as builder,
  purgeCache,
  schedule,
  stream
};
