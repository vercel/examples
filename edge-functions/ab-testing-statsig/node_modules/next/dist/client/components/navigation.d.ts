declare const INTERNAL_URLSEARCHPARAMS_INSTANCE: unique symbol;
declare class ReadonlyURLSearchParams {
    [INTERNAL_URLSEARCHPARAMS_INSTANCE]: URLSearchParams;
    entries: URLSearchParams['entries'];
    forEach: URLSearchParams['forEach'];
    get: URLSearchParams['get'];
    getAll: URLSearchParams['getAll'];
    has: URLSearchParams['has'];
    keys: URLSearchParams['keys'];
    values: URLSearchParams['values'];
    toString: URLSearchParams['toString'];
    constructor(urlSearchParams: URLSearchParams);
    [Symbol.iterator](): IterableIterator<[string, string]>;
    append(): void;
    delete(): void;
    set(): void;
    sort(): void;
}
/**
 * Get a read-only URLSearchParams object. For example searchParams.get('foo') would return 'bar' when ?foo=bar
 * Learn more about URLSearchParams here: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
 */
export declare function useSearchParams(): ReadonlyURLSearchParams;
/**
 * Get the current pathname. For example usePathname() on /dashboard?foo=bar would return "/dashboard"
 */
export declare function usePathname(): string | null;
export { ServerInsertedHTMLContext, useServerInsertedHTML, } from '../../shared/lib/server-inserted-html';
/**
 * Get the router methods. For example router.push('/dashboard')
 */
export declare function useRouter(): import('../../shared/lib/app-router-context').AppRouterInstance;
/**
 * Get the canonical segment path from the current level to the leaf node.
 */
export declare function useSelectedLayoutSegments(parallelRouteKey?: string): string[];
/**
 * Get the segment below the current level
 */
export declare function useSelectedLayoutSegment(parallelRouteKey?: string): string | null;
export { redirect } from './redirect';
export { notFound } from './not-found';
