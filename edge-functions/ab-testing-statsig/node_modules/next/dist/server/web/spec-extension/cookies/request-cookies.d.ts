import type { RequestCookie } from './types';
/**
 * A class for manipulating {@link Request} cookies (`Cookie` header).
 */
export declare class RequestCookies {
    readonly _headers: Headers;
    _parsed: Map<string, RequestCookie>;
    constructor(requestHeaders: Headers);
    [Symbol.iterator](): IterableIterator<[string, RequestCookie]>;
    /**
     * The amount of cookies received from the client
     */
    get size(): number;
    get(...args: [name: string] | [RequestCookie]): RequestCookie | undefined;
    getAll(...args: [name: string] | [RequestCookie] | []): RequestCookie[];
    has(name: string): boolean;
    set(...args: [key: string, value: string] | [options: RequestCookie]): this;
    /**
     * Delete the cookies matching the passed name or names in the request.
     */
    delete(
    /** Name or names of the cookies to be deleted  */
    names: string | string[]): boolean | boolean[];
    /**
     * Delete all the cookies in the cookies in the request.
     */
    clear(): this;
}
