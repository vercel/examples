import type NodeHttp from "node:http";
import { Socket } from "node:net";
import { Readable } from "node:stream";
// Docs: https://nodejs.org/api/http.html#http_class_http_incomingmessage
// Implementation: https://github.com/nodejs/node/blob/master/lib/_http_incoming.js
export declare class IncomingMessage extends Readable implements NodeHttp.IncomingMessage {
	__unenv__: {};
	aborted: boolean;
	httpVersion: string;
	httpVersionMajor: number;
	httpVersionMinor: number;
	complete: boolean;
	connection: Socket;
	socket: Socket;
	headers: NodeHttp.IncomingHttpHeaders;
	trailers: {};
	method: string;
	url: string;
	statusCode: number;
	statusMessage: string;
	closed: boolean;
	errored: Error | null;
	readable: boolean;
	constructor(socket?: Socket);
	get rawHeaders();
	get rawTrailers(): unknown;
	setTimeout(_msecs: number, _callback?: () => void);
	get headersDistinct();
	get trailersDistinct();
	_read();
}
