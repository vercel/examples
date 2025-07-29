// https://github.com/node-fetch/node-fetch
// Native browser APIs
export const fetch = (...args) => globalThis.fetch(...args);
export const Headers = globalThis.Headers;
export const Request = globalThis.Request;
export const Response = globalThis.Response;
export const AbortController = globalThis.AbortController;
// Error handling
export const FetchError = Error;
export const AbortError = Error;
// Top-level exported helpers (from node-fetch v3)
const redirectStatus = new Set([
	301,
	302,
	303,
	307,
	308
]);
export const isRedirect = (code) => redirectStatus.has(code);
// node-fetch v2
fetch.Promise = globalThis.Promise;
fetch.isRedirect = isRedirect;
export default fetch;
