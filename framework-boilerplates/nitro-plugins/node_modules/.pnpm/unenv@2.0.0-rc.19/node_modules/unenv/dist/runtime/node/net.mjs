import { notImplemented, notImplementedClass } from "../_internal/utils.mjs";
import { Socket, SocketAddress } from "./internal/net/socket.mjs";
import { Server } from "./internal/net/server.mjs";
export { Server } from "./internal/net/server.mjs";
// require('node:net').Socket === require('node:net').Stream
export { Socket, SocketAddress, Socket as Stream } from "./internal/net/socket.mjs";
export const createServer = /* @__PURE__ */ notImplemented("net.createServer");
export const BlockList = /* @__PURE__ */ notImplementedClass("net.BlockList");
export const connect = /* @__PURE__ */ notImplemented("net.connect");
export const createConnection = /* @__PURE__ */ notImplemented("net.createConnection");
export const getDefaultAutoSelectFamily = /* @__PURE__ */ notImplemented("net.getDefaultAutoSelectFamily");
export const setDefaultAutoSelectFamily = /* @__PURE__ */ notImplemented("net.setDefaultAutoSelectFamily");
export const getDefaultAutoSelectFamilyAttemptTimeout = /* @__PURE__ */ notImplemented("net.getDefaultAutoSelectFamilyAttemptTimeout");
export const setDefaultAutoSelectFamilyAttemptTimeout = /* @__PURE__ */ notImplemented("net.setDefaultAutoSelectFamilyAttemptTimeout");
const IPV4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
export const isIPv4 = (host) => IPV4Regex.test(host);
const IPV6Regex = /^([\dA-Fa-f]{1,4}:){7}[\dA-Fa-f]{1,4}$/;
export const isIPv6 = (host) => IPV6Regex.test(host);
export const isIP = (host) => {
	if (isIPv4(host)) {
		return 4;
	}
	if (isIPv6(host)) {
		return 6;
	}
	return 0;
};
// --- internal ---
export const _createServerHandle = /* @__PURE__ */ notImplemented("net._createServerHandle");
export const _normalizeArgs = /* @__PURE__ */ notImplemented("net._normalizeArgs");
export const _setSimultaneousAccepts = /* @__PURE__ */ notImplemented("net._setSimultaneousAccepts");
const exports = {
	Socket,
	Stream: Socket,
	Server,
	BlockList,
	SocketAddress,
	createServer,
	connect,
	createConnection,
	isIPv4,
	isIPv6,
	isIP,
	getDefaultAutoSelectFamily,
	getDefaultAutoSelectFamilyAttemptTimeout,
	setDefaultAutoSelectFamily,
	setDefaultAutoSelectFamilyAttemptTimeout,
	_createServerHandle,
	_normalizeArgs,
	_setSimultaneousAccepts
};
export default exports;
