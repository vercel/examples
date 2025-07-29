import { $ as $Fetch } from './shared/ofetch.d0b3d489.mjs';
export { C as CreateFetchOptions, j as Fetch, d as FetchContext, F as FetchError, e as FetchHook, f as FetchHooks, b as FetchOptions, k as FetchRequest, i as FetchResponse, G as GlobalOptions, I as IFetchError, M as MappedResponseType, R as ResolvedFetchOptions, g as ResponseMap, h as ResponseType, S as SearchParameters, c as createFetch, a as createFetchError } from './shared/ofetch.d0b3d489.mjs';
import 'undici';

declare const fetch: (input: string | URL | Request, init?: RequestInit | undefined) => Promise<Response>;
declare const Headers: {
    new (init?: HeadersInit): Headers;
    prototype: Headers;
};
declare const AbortController: {
    new (): AbortController;
    prototype: AbortController;
};
declare const ofetch: $Fetch;
declare const $fetch: $Fetch;

export { $Fetch, $fetch, AbortController, Headers, fetch, ofetch };
