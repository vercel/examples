import type { Readable } from "node:stream";
export declare function requestHasBody(request: globalThis.Request): boolean;
export declare function useRequestBody(request: globalThis.Request): Promise<any>;
export declare function trapUnhandledNodeErrors(): void;
export declare function joinHeaders(value: number | string | string[]): string;
export declare function normalizeFetchResponse(response: Response): Response;
export declare function normalizeCookieHeader(header?: number | string | string[]): string[];
export declare function normalizeCookieHeaders(headers: Headers): Headers;
export declare function toBuffer(data: ReadableStream | Readable | Uint8Array): Promise<Buffer<ArrayBufferLike>> | Buffer<ArrayBuffer>;
