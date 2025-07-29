import type nodeTls from "node:tls";
import { Socket } from "node:net";
export declare class TLSSocket extends Socket implements nodeTls.TLSSocket {
	authorized: boolean;
	encrypted: true;
	alpnProtocol: null;
	authorizationError: Error;
	exportKeyingMaterial(): Buffer;
	getCipher(): nodeTls.CipherNameAndProtocol;
	getPeerCertificate(detailed: true): nodeTls.DetailedPeerCertificate;
	getPeerCertificate(detailed?: false): nodeTls.PeerCertificate;
	getPeerCertificate(detailed?: boolean): nodeTls.PeerCertificate | nodeTls.DetailedPeerCertificate;
	getCertificate(): null;
	getEphemeralKeyInfo(): null;
	getFinished(): undefined;
	getPeerFinished(): undefined;
	getProtocol(): null;
	getSession(): undefined;
	getSharedSigalgs(): unknown;
	getTLSTicket(): undefined;
	isSessionReused(): boolean;
	renegotiate(options: {
		rejectUnauthorized?: boolean | undefined;
		requestCert?: boolean | undefined;
	}, callback: (err: Error | null) => void): undefined;
	setMaxSendFragment(size: number): boolean;
	disableRenegotiation();
	enableTrace();
	getPeerX509Certificate(): undefined;
	getX509Certificate(): undefined;
}
