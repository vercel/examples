import { Socket } from "node:net";
import { Readable } from "node:stream";
import { rawHeaders } from "../../../_internal/utils.mjs";
// Docs: https://nodejs.org/api/http.html#http_class_http_incomingmessage
// Implementation: https://github.com/nodejs/node/blob/master/lib/_http_incoming.js
export class IncomingMessage extends Readable {
	__unenv__ = {};
	aborted = false;
	httpVersion = "1.1";
	httpVersionMajor = 1;
	httpVersionMinor = 1;
	complete = true;
	connection;
	socket;
	headers = {};
	trailers = {};
	method = "GET";
	url = "/";
	statusCode = 200;
	statusMessage = "";
	closed = false;
	errored = null;
	readable = false;
	constructor(socket) {
		super();
		this.socket = this.connection = socket || new Socket();
	}
	get rawHeaders() {
		return rawHeaders(this.headers);
	}
	get rawTrailers() {
		return [];
	}
	setTimeout(_msecs, _callback) {
		return this;
	}
	get headersDistinct() {
		return _distinct(this.headers);
	}
	get trailersDistinct() {
		return _distinct(this.trailers);
	}
	_read() {}
}
function _distinct(obj) {
	const d = {};
	for (const [key, value] of Object.entries(obj)) {
		if (key) {
			d[key] = (Array.isArray(value) ? value : [value]).filter(Boolean);
		}
	}
	return d;
}
