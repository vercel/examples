import { Socket } from "node:net";
import { createNotImplementedError } from "../../../_internal/utils.mjs";
export class TLSSocket extends Socket {
	authorized = false;
	encrypted = true;
	alpnProtocol = null;
	authorizationError = new Error("[unenv] TLSSocket.authorizationError is not implemented yet!");
	exportKeyingMaterial() {
		throw createNotImplementedError("TLSSocket.exportKeyingMaterial");
	}
	getCipher() {
		throw createNotImplementedError("TLSSocket.getCipher");
	}
	getPeerCertificate(_detailed) {
		throw createNotImplementedError("TLSSocket.getPeerCertificate");
	}
	getCertificate() {
		return null;
	}
	getEphemeralKeyInfo() {
		return null;
	}
	getFinished() {}
	getPeerFinished() {}
	getProtocol() {
		return null;
	}
	getSession() {}
	getSharedSigalgs() {
		return [];
	}
	getTLSTicket() {}
	isSessionReused() {
		return false;
	}
	renegotiate(options, callback) {
		if (typeof callback === "function") {
			callback(null);
		}
	}
	setMaxSendFragment(size) {
		return false;
	}
	disableRenegotiation() {}
	enableTrace() {}
	getPeerX509Certificate() {}
	getX509Certificate() {}
}
