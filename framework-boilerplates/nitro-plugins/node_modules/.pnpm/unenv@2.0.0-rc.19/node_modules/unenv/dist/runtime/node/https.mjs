import { notImplemented, notImplementedClass } from "../_internal/utils.mjs";
import { Agent as HttpAgent } from "./internal/http/agent.mjs";
export const Server = /* @__PURE__ */ notImplementedClass("https.Server");
export const Agent = HttpAgent;
export const globalAgent = /* @__PURE__ */ new Agent();
export const get = /* @__PURE__ */ notImplemented("https.get");
export const createServer = /* @__PURE__ */ notImplemented("https.createServer");
export const request = /* @__PURE__ */ notImplemented("https.request");
export default {
	Server,
	Agent,
	globalAgent,
	get,
	createServer,
	request
};
