import { createNotImplementedError } from "../../../_internal/utils.mjs";
import { Server as _Server } from "node:net";
export class Server extends _Server {
	constructor(arg1, arg2) {
		super(arg1, arg2);
	}
	addContext(hostname, context) {}
	setSecureContext(options) {}
	setTicketKeys(_keys) {
		throw createNotImplementedError("Server.setTicketKeys");
	}
	getTicketKeys() {
		throw createNotImplementedError("Server.getTicketKeys");
	}
}
