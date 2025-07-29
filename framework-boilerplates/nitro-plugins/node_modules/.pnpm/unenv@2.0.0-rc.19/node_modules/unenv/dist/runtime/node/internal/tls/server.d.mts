import type nodeTls from "node:tls";
import { Server as _Server } from "node:net";
export declare class Server extends _Server implements nodeTls.Server {
	constructor(arg1?: nodeTls.TlsOptions | ((socket: nodeTls.TLSSocket) => void), arg2?: (socket: nodeTls.TLSSocket) => void);
	addContext(hostname: string, context: nodeTls.SecureContextOptions);
	setSecureContext(options: nodeTls.SecureContextOptions);
	setTicketKeys(_keys: Buffer);
	getTicketKeys(): Buffer;
}
