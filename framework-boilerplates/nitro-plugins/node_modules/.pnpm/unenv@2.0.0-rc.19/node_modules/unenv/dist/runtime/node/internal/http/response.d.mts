import type nodeHttp from "node:http";
import type { Socket } from "node:net";
import type { Callback } from "../../../_internal/types.mjs";
import { Writable } from "node:stream";
// Docs: https://nodejs.org/api/http.html#http_class_http_serverresponse
// Implementation: https://github.com/nodejs/node/blob/master/lib/_http_outgoing.js
export declare class ServerResponse extends Writable implements nodeHttp.ServerResponse {
	readonly __unenv__: true;
	statusCode: number;
	statusMessage: string;
	upgrading: boolean;
	chunkedEncoding: boolean;
	shouldKeepAlive: boolean;
	useChunkedEncodingByDefault: boolean;
	sendDate: boolean;
	finished: boolean;
	headersSent: boolean;
	strictContentLength: boolean;
	connection: Socket | null;
	socket: Socket | null;
	req: nodeHttp.IncomingMessage;
	_headers: Record<string, number | string | string[] | undefined>;
	constructor(req: nodeHttp.IncomingMessage);
	assignSocket(socket: Socket): void;
	_flush();
	detachSocket(_socket: Socket): void;
	writeContinue(_callback?: Callback): void;
	writeHead(statusCode: number, arg1?: string | nodeHttp.OutgoingHttpHeaders | nodeHttp.OutgoingHttpHeader[], arg2?: nodeHttp.OutgoingHttpHeaders | nodeHttp.OutgoingHttpHeader[]);
	writeProcessing(): void;
	setTimeout(_msecs: number, _callback?: Callback): this;
	appendHeader(name: string, value: string | string[]);
	setHeader(name: string, value: number | string | readonly string[]): this;
	setHeaders(headers: Headers | Map<string, number | string | readonly string[]>): this;
	getHeader(name: string): number | string | string[] | undefined;
	getHeaders(): nodeHttp.OutgoingHttpHeaders;
	getHeaderNames(): string[];
	hasHeader(name: string): boolean;
	removeHeader(name: string): void;
	addTrailers(_headers: nodeHttp.OutgoingHttpHeaders | ReadonlyArray<[string, string]>): void;
	flushHeaders(): void;
	writeEarlyHints(_headers: nodeHttp.OutgoingHttpHeaders, cb: () => void): void;
}
