/// <reference types="node" />
/// <reference types="react" />
import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from 'http';
import type { LoadComponentsReturnType } from './load-components';
import type { ServerRuntime } from '../types';
import type { FontLoaderManifest } from '../build/webpack/plugins/font-loader-manifest-plugin';
import React from 'next/dist/compiled/react';
import { NextParsedUrlQuery } from './request-meta';
import RenderResult from './render-result';
import { FlightCSSManifest, FlightManifest } from '../build/webpack/plugins/flight-manifest-plugin';
import { RequestCookies } from './web/spec-extension/cookies';
declare const INTERNAL_HEADERS_INSTANCE: unique symbol;
export declare class ReadonlyHeaders {
    [INTERNAL_HEADERS_INSTANCE]: Headers;
    entries: Headers['entries'];
    forEach: Headers['forEach'];
    get: Headers['get'];
    has: Headers['has'];
    keys: Headers['keys'];
    values: Headers['values'];
    constructor(headers: IncomingHttpHeaders);
    [Symbol.iterator](): IterableIterator<[string, string]>;
    append(): void;
    delete(): void;
    set(): void;
}
declare const INTERNAL_COOKIES_INSTANCE: unique symbol;
export declare class ReadonlyRequestCookies {
    [INTERNAL_COOKIES_INSTANCE]: RequestCookies;
    get: RequestCookies['get'];
    getAll: RequestCookies['getAll'];
    has: RequestCookies['has'];
    constructor(request: {
        headers: {
            get(key: 'cookie'): string | null | undefined;
        };
    });
    [Symbol.iterator](): any;
    clear(): void;
    delete(): void;
    set(): void;
}
export declare type RenderOptsPartial = {
    err?: Error | null;
    dev?: boolean;
    serverComponentManifest?: FlightManifest;
    serverCSSManifest?: FlightCSSManifest;
    supportsDynamicHTML?: boolean;
    runtime?: ServerRuntime;
    serverComponents?: boolean;
    assetPrefix?: string;
    fontLoaderManifest?: FontLoaderManifest;
    isBot?: boolean;
    incrementalCache?: import('./lib/incremental-cache').IncrementalCache;
    isRevalidate?: boolean;
};
export declare type RenderOpts = LoadComponentsReturnType & RenderOptsPartial;
export declare type DynamicParamTypesShort = 'c' | 'oc' | 'd';
/**
 * Segment in the router state.
 */
export declare type Segment = string | [param: string, value: string, type: DynamicParamTypesShort];
/**
 * Router state
 */
export declare type FlightRouterState = [
    segment: Segment,
    parallelRoutes: {
        [parallelRouterKey: string]: FlightRouterState;
    },
    url?: string,
    refresh?: 'refetch',
    isRootLayout?: boolean
];
/**
 * Individual Flight response path
 */
export declare type FlightSegmentPath = any[] | [
    segment: Segment,
    parallelRouterKey: string,
    segment: Segment,
    parallelRouterKey: string,
    segment: Segment,
    parallelRouterKey: string
];
export declare type FlightDataPath = any[] | [
    ...FlightSegmentPath[],
    Segment,
    FlightRouterState,
    React.ReactNode | null,
    // Can be null during prefetch if there's no loading component
    React.ReactNode | null
];
/**
 * The Flight response data
 */
export declare type FlightData = Array<FlightDataPath> | string;
/**
 * Property holding the current subTreeData.
 */
export declare type ChildProp = {
    /**
     * Null indicates that the tree is partial
     */
    current: React.ReactNode | null;
    segment: Segment;
};
export declare function renderToHTMLOrFlight(req: IncomingMessage, res: ServerResponse, pathname: string, query: NextParsedUrlQuery, renderOpts: RenderOpts): Promise<RenderResult | null>;
export {};
