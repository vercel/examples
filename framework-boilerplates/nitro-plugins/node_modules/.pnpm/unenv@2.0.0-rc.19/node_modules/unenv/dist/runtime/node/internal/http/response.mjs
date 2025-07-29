import { Writable } from "node:stream";
// Docs: https://nodejs.org/api/http.html#http_class_http_serverresponse
// Implementation: https://github.com/nodejs/node/blob/master/lib/_http_outgoing.js
export class ServerResponse extends Writable {
	__unenv__ = true;
	statusCode = 200;
	statusMessage = "";
	upgrading = false;
	chunkedEncoding = false;
	shouldKeepAlive = false;
	useChunkedEncodingByDefault = false;
	sendDate = false;
	finished = false;
	headersSent = false;
	strictContentLength = false;
	connection = null;
	socket = null;
	req;
	_headers = {};
	constructor(req) {
		super();
		this.req = req;
	}
	assignSocket(socket) {
		// @ts-ignore
		socket._httpMessage = this;
		// socket.on('close', onServerResponseClose)
		this.socket = socket;
		this.connection = socket;
		this.emit("socket", socket);
		this._flush();
	}
	_flush() {
		this.flushHeaders();
	}
	detachSocket(_socket) {}
	writeContinue(_callback) {}
	writeHead(statusCode, arg1, arg2) {
		if (statusCode) {
			this.statusCode = statusCode;
		}
		if (typeof arg1 === "string") {
			this.statusMessage = arg1;
			arg1 = undefined;
		}
		const headers = arg2 || arg1;
		if (headers) {
			if (Array.isArray(headers)) {} else {
				for (const key in headers) {
					// @ts-ignore
					this.setHeader(key, headers[key]);
				}
			}
		}
		this.headersSent = true;
		return this;
	}
	writeProcessing() {}
	setTimeout(_msecs, _callback) {
		return this;
	}
	appendHeader(name, value) {
		name = name.toLowerCase();
		const current = this._headers[name];
		const all = [...Array.isArray(current) ? current : [current], ...Array.isArray(value) ? value : [value]].filter(Boolean);
		this._headers[name] = all.length > 1 ? all : all[0];
		return this;
	}
	setHeader(name, value) {
		this._headers[name.toLowerCase()] = Array.isArray(value) ? [...value] : value;
		return this;
	}
	setHeaders(headers) {
		for (const [key, value] of headers.entries()) {
			this.setHeader(key, value);
		}
		return this;
	}
	getHeader(name) {
		return this._headers[name.toLowerCase()];
	}
	getHeaders() {
		return this._headers;
	}
	getHeaderNames() {
		return Object.keys(this._headers);
	}
	hasHeader(name) {
		return name.toLowerCase() in this._headers;
	}
	removeHeader(name) {
		delete this._headers[name.toLowerCase()];
	}
	addTrailers(_headers) {}
	flushHeaders() {}
	writeEarlyHints(_headers, cb) {
		if (typeof cb === "function") {
			cb();
		}
	}
}
