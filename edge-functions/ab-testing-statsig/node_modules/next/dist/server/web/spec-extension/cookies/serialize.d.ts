import type { RequestCookie, ResponseCookie } from './types';
export declare function serialize(c: ResponseCookie | RequestCookie): string;
/**
 * Parse a `Cookie` or `Set-Cookie header value
 */
export declare function parseCookieString(cookie: string): Map<string, string>;
/**
 * Parse a `Set-Cookie` header value
 */
export declare function parseSetCookieString(setCookie: string): undefined | ResponseCookie;
