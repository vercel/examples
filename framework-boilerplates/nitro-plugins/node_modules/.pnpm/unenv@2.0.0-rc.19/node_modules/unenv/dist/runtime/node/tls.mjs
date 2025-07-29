import { notImplemented } from "../_internal/utils.mjs";
import { TLSSocket } from "./internal/tls/tls-socket.mjs";
import { Server } from "./internal/tls/server.mjs";
import { SecureContext } from "./internal/tls/secure-context.mjs";
// prettier-ignore
import { CLIENT_RENEG_LIMIT, CLIENT_RENEG_WINDOW, DEFAULT_CIPHERS, DEFAULT_ECDH_CURVE, DEFAULT_MAX_VERSION, DEFAULT_MIN_VERSION } from "./internal/tls/constants.mjs";
export * from "./internal/tls/constants.mjs";
export { TLSSocket } from "./internal/tls/tls-socket.mjs";
export { Server } from "./internal/tls/server.mjs";
export { SecureContext } from "./internal/tls/secure-context.mjs";
export const connect = function connect() {
	return new TLSSocket();
};
export const createServer = function createServer() {
	return new Server();
};
export const checkServerIdentity = /* @__PURE__ */ notImplemented("tls.checkServerIdentity");
export const convertALPNProtocols = /* @__PURE__ */ notImplemented("tls.convertALPNProtocols");
export const createSecureContext = /* @__PURE__ */ notImplemented("tls.createSecureContext");
export const createSecurePair = /* @__PURE__ */ notImplemented("tls.createSecurePair");
export const getCiphers = /* @__PURE__ */ notImplemented("tls.getCiphers");
export const rootCertificates = [];
export default {
	CLIENT_RENEG_LIMIT,
	CLIENT_RENEG_WINDOW,
	DEFAULT_CIPHERS,
	DEFAULT_ECDH_CURVE,
	DEFAULT_MAX_VERSION,
	DEFAULT_MIN_VERSION,
	SecureContext,
	Server,
	TLSSocket,
	checkServerIdentity,
	connect,
	convertALPNProtocols,
	createSecureContext,
	createSecurePair,
	createServer,
	getCiphers,
	rootCertificates
};
