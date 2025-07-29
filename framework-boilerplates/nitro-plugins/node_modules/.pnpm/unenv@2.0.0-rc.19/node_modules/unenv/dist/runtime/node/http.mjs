import { notImplemented, notImplementedClass } from "../_internal/utils.mjs";
import { IncomingMessage } from "./internal/http/request.mjs";
import { ServerResponse } from "./internal/http/response.mjs";
import { Agent } from "./internal/http/agent.mjs";
import { METHODS, STATUS_CODES, maxHeaderSize } from "./internal/http/constants.mjs";
export { METHODS, STATUS_CODES, maxHeaderSize };
export * from "./internal/http/request.mjs";
export * from "./internal/http/response.mjs";
export { Agent } from "./internal/http/agent.mjs";
export const createServer = /* @__PURE__ */ notImplemented("http.createServer");
export const request = /* @__PURE__ */ notImplemented("http.request");
export const get = /* @__PURE__ */ notImplemented("http.get");
export const Server = /* @__PURE__ */ notImplementedClass("http.Server");
export const OutgoingMessage = /* @__PURE__ */ notImplementedClass("http.OutgoingMessage");
export const ClientRequest = /* @__PURE__ */ notImplementedClass("http.ClientRequest");
export const globalAgent = new Agent();
export const validateHeaderName = /* @__PURE__ */ notImplemented("http.validateHeaderName");
export const validateHeaderValue = /* @__PURE__ */ notImplemented("http.validateHeaderValue");
export const setMaxIdleHTTPParsers = /* @__PURE__ */ notImplemented("http.setMaxIdleHTTPParsers");
export const _connectionListener = /* @__PURE__ */ notImplemented("http._connectionListener");
export const WebSocket = globalThis.WebSocket || /* @__PURE__ */ notImplementedClass("WebSocket");
export const CloseEvent = globalThis.CloseEvent || /* @__PURE__ */ notImplementedClass("CloseEvent");
export const MessageEvent = globalThis.MessageEvent || /* @__PURE__ */ notImplementedClass("MessageEvent");
export default {
	METHODS,
	STATUS_CODES,
	maxHeaderSize,
	IncomingMessage,
	ServerResponse,
	WebSocket,
	CloseEvent,
	MessageEvent,
	createServer,
	request,
	get,
	Server,
	OutgoingMessage,
	ClientRequest,
	Agent,
	globalAgent,
	validateHeaderName,
	validateHeaderValue,
	setMaxIdleHTTPParsers,
	_connectionListener
};
