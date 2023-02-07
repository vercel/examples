import type { ResponseCookie } from './types';
/**
 * A class for manipulating {@link Response} cookies (`Set-Cookie` header).
 * Loose implementation of the experimental [Cookie Store API](https://wicg.github.io/cookie-store/#dictdef-cookie)
 * The main difference is `ResponseCookies` methods do not return a Promise.
 */
export declare class ResponseCookies {
    readonly _headers: Headers;
    _parsed: Map<string, ResponseCookie>;
    constructor(responseHeaders: Headers);
    /**
     * {@link https://wicg.github.io/cookie-store/#CookieStore-get CookieStore#get} without the Promise.
     */
    get(...args: [key: string] | [options: ResponseCookie]): ResponseCookie | undefined;
    /**
     * {@link https://wicg.github.io/cookie-store/#CookieStore-getAll CookieStore#getAll} without the Promise.
     */
    getAll(...args: [key: string] | [options: ResponseCookie] | []): ResponseCookie[];
    /**
     * {@link https://wicg.github.io/cookie-store/#CookieStore-set CookieStore#set} without the Promise.
     */
    set(...args: [key: string, value: string, cookie?: Partial<ResponseCookie>] | [options: ResponseCookie]): this;
    /**
     * {@link https://wicg.github.io/cookie-store/#CookieStore-delete CookieStore#delete} without the Promise.
     */
    delete(...args: [key: string] | [options: ResponseCookie]): this;
}
