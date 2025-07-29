import { App, Router, H3Event, RouterMethod } from 'h3';
import { FetchRequest, FetchOptions, FetchResponse } from 'ofetch';
import { a as NitroOptions, b as NitroConfig, N as NitroModule } from '../shared/nitro.DLF2_KRt.js';
export { A as AppConfig, C as CacheEntry, c as CacheOptions, d as CachedEventHandlerOptions, e as CompressOptions, g as DatabaseConnectionConfig, h as DatabaseConnectionConfigs, D as DatabaseConnectionName, l as DevServerOptions, I as EsbuildOptions, O as HTTPStatusCode, L as LoadConfigOptions, u as Nitro, y as NitroBuildInfo, q as NitroDevEventHandler, n as NitroDevServer, v as NitroDynamicConfig, r as NitroErrorHandler, p as NitroEventHandler, x as NitroFrameworkInfo, s as NitroHooks, t as NitroModuleInput, k as NitroOpenAPIConfig, E as NitroPreset, F as NitroPresetMeta, Q as NitroRouteConfig, o as NitroRouteMeta, T as NitroRouteRules, j as NitroRuntimeConfig, i as NitroRuntimeConfigApp, w as NitroTypes, m as NitroWorker, J as NodeExternalsOptions, B as PrerenderGenerateRoute, z as PrerenderRoute, P as PublicAssetDir, M as RawOptions, R as ResponseCacheEntry, G as RollupConfig, H as RollupVirtualOptions, S as ServerAssetDir, K as ServerAssetOptions, f as StorageMounts, V as VirtualModule } from '../shared/nitro.DLF2_KRt.js';
import { Hookable } from 'hookable';
import { NitroRuntimeHooks as NitroRuntimeHooks$1 } from 'nitropack';
import { AbstractRequest, AbstractResponse } from 'node-mock-http';
import { CaptureError as CaptureError$1, CapturedErrorContext as CapturedErrorContext$1, CacheOptions } from 'nitropack/types';
import 'consola';
import 'nitropack/presets';
import 'unimport';
import 'unstorage';
import '@rollup/plugin-commonjs';
import 'c12';
import 'chokidar';
import 'compatx';
import 'db0';
import 'httpxy';
import 'pkg-types';
import 'rollup-plugin-visualizer';
import 'unenv';
import 'unimport/unplugin';
import 'unwasm/plugin';
import 'node:http';
import 'node:stream';
import 'node:worker_threads';
import 'listhen';
import 'unplugin-utils';
import '@vercel/nft';
import 'esbuild';
import 'rollup';
import '@scalar/api-reference';
import 'std-env';

interface PublicAsset {
    type: string;
    etag: string;
    mtime: string;
    path: string;
    size: number;
    encoding?: string;
    data?: string;
}
interface AssetMeta {
    type?: string;
    etag?: string;
    mtime?: string;
}

interface NitroApp {
    h3App: App;
    router: Router;
    hooks: Hookable<NitroRuntimeHooks>;
    localCall: (aRequest: AbstractRequest) => Promise<AbstractResponse>;
    localFetch: (req: string | URL | Request, init?: RequestInit & AbstractRequest) => Promise<Response>;
    captureError: CaptureError;
}
interface NitroAppPlugin {
    (nitro: NitroApp): void;
}
interface NitroAsyncContext {
    event: H3Event;
}
interface RenderResponse {
    body: any;
    statusCode: number;
    statusMessage: string;
    headers: Record<string, string>;
}
type RenderHandler = (event: H3Event) => Partial<RenderResponse> | Promise<Partial<RenderResponse>>;
interface RenderContext {
    event: H3Event;
    render: RenderHandler;
    response?: Partial<RenderResponse>;
}
interface CapturedErrorContext {
    event?: H3Event;
    [key: string]: unknown;
}
type CaptureError = (error: Error, context: CapturedErrorContext) => void;
interface NitroRuntimeHooks extends NitroRuntimeHooks$1 {
}

type MaybePromise<T> = T | Promise<T>;
/** @experimental */
interface TaskContext {
}
/** @experimental */
interface TaskPayload {
    [key: string]: unknown;
}
/** @experimental */
interface TaskMeta {
    name?: string;
    description?: string;
}
/** @experimental */
interface TaskEvent {
    name: string;
    payload: TaskPayload;
    context: TaskContext;
}
/** @experimental */
interface TaskResult<RT = unknown> {
    result?: RT;
}
/** @experimental */
interface Task<RT = unknown> {
    meta?: TaskMeta;
    run(event: TaskEvent): MaybePromise<{
        result?: RT;
    }>;
}
/** @experimental */
interface TaskRunnerOptions {
    cwd?: string;
    buildDir?: string;
}

interface InternalApi {
}
type NitroFetchRequest = Exclude<keyof InternalApi, `/_${string}` | `/api/_${string}`> | Exclude<FetchRequest, string> | (string & {});
type MiddlewareOf<Route extends string, Method extends RouterMethod | "default"> = Method extends keyof InternalApi[MatchedRoutes<Route>] ? InternalApi[MatchedRoutes<Route>][Method] : never;
type TypedInternalResponse<Route, Default = unknown, Method extends RouterMethod = RouterMethod> = Default extends string | boolean | number | null | void | object ? Default : Route extends string ? MiddlewareOf<Route, Method> extends never ? MiddlewareOf<Route, "default"> extends never ? Default : MiddlewareOf<Route, "default"> : MiddlewareOf<Route, Method> : Default;
type AvailableRouterMethod<R extends NitroFetchRequest> = R extends string ? keyof InternalApi[MatchedRoutes<R>] extends undefined ? RouterMethod : Extract<keyof InternalApi[MatchedRoutes<R>], "default"> extends undefined ? Extract<RouterMethod, keyof InternalApi[MatchedRoutes<R>]> : RouterMethod : RouterMethod;
interface NitroFetchOptions<R extends NitroFetchRequest, M extends AvailableRouterMethod<R> = AvailableRouterMethod<R>> extends FetchOptions {
    method?: Uppercase<M> | M;
}
type ExtractedRouteMethod<R extends NitroFetchRequest, O extends NitroFetchOptions<R>> = O extends undefined ? "get" : Lowercase<Exclude<O["method"], undefined>> extends RouterMethod ? Lowercase<Exclude<O["method"], undefined>> : "get";
type Base$Fetch<DefaultT = unknown, DefaultR extends NitroFetchRequest = NitroFetchRequest> = <T = DefaultT, R extends NitroFetchRequest = DefaultR, O extends NitroFetchOptions<R> = NitroFetchOptions<R>>(request: R, opts?: O) => Promise<TypedInternalResponse<R, T, NitroFetchOptions<R> extends O ? "get" : ExtractedRouteMethod<R, O>>>;
interface $Fetch<DefaultT = unknown, DefaultR extends NitroFetchRequest = NitroFetchRequest> extends Base$Fetch<DefaultT, DefaultR> {
    raw<T = DefaultT, R extends NitroFetchRequest = DefaultR, O extends NitroFetchOptions<R> = NitroFetchOptions<R>>(request: R, opts?: O): Promise<FetchResponse<TypedInternalResponse<R, T, NitroFetchOptions<R> extends O ? "get" : ExtractedRouteMethod<R, O>>>>;
    create<T = DefaultT, R extends NitroFetchRequest = DefaultR>(defaults: FetchOptions): $Fetch<T, R>;
}
declare global {
    var $fetch: $Fetch;
    namespace NodeJS {
        interface Global {
            $fetch: $Fetch;
        }
    }
}

type MatchResult<Key extends string, Exact extends boolean = false, Score extends any[] = [], catchAll extends boolean = false> = {
    [k in Key]: {
        key: k;
        exact: Exact;
        score: Score;
        catchAll: catchAll;
    };
}[Key];
type Subtract<Minuend extends any[] = [], Subtrahend extends any[] = []> = Minuend extends [...Subtrahend, ...infer Remainder] ? Remainder : never;
type TupleIfDiff<First extends string, Second extends string, Tuple extends any[] = []> = First extends `${Second}${infer Diff}` ? Diff extends "" ? [] : Tuple : [];
type MaxTuple<N extends any[] = [], T extends any[] = []> = {
    current: T;
    result: MaxTuple<N, ["", ...T]>;
}[[N["length"]] extends [Partial<T>["length"]] ? "current" : "result"];
type CalcMatchScore<Key extends string, Route extends string, Score extends any[] = [], Init extends boolean = false, FirstKeySegMatcher extends string = Init extends true ? ":Invalid:" : ""> = `${Key}/` extends `${infer KeySeg}/${infer KeyRest}` ? KeySeg extends FirstKeySegMatcher ? Subtract<[
    ...Score,
    ...TupleIfDiff<Route, Key, ["", ""]>
], TupleIfDiff<Key, Route, ["", ""]>> : `${Route}/` extends `${infer RouteSeg}/${infer RouteRest}` ? `${RouteSeg}?` extends `${infer RouteSegWithoutQuery}?${string}` ? RouteSegWithoutQuery extends KeySeg ? CalcMatchScore<KeyRest, RouteRest, [...Score, "", ""]> : KeySeg extends `:${string}` ? RouteSegWithoutQuery extends "" ? never : CalcMatchScore<KeyRest, RouteRest, [...Score, ""]> : KeySeg extends RouteSegWithoutQuery ? CalcMatchScore<KeyRest, RouteRest, [...Score, ""]> : never : never : never : never;
type _MatchedRoutes<Route extends string, MatchedResultUnion extends MatchResult<string> = MatchResult<keyof InternalApi>> = MatchedResultUnion["key"] extends infer MatchedKeys ? MatchedKeys extends string ? Route extends MatchedKeys ? MatchResult<MatchedKeys, true> : MatchedKeys extends `${infer Root}/**${string}` ? MatchedKeys extends `${string}/**` ? Route extends `${Root}/${string}` ? MatchResult<MatchedKeys, false, [], true> : never : MatchResult<MatchedKeys, false, CalcMatchScore<Root, Route, [], true>> : MatchResult<MatchedKeys, false, CalcMatchScore<MatchedKeys, Route, [], true>> : never : never;
type MatchedRoutes<Route extends string, MatchedKeysResult extends MatchResult<string> = MatchResult<keyof InternalApi>, Matches extends MatchResult<string> = _MatchedRoutes<Route, MatchedKeysResult>> = Route extends "/" ? keyof InternalApi : Extract<Matches, {
    exact: true;
}> extends never ? Extract<Exclude<Matches, {
    score: never;
}>, {
    score: MaxTuple<Matches["score"]>;
}>["key"] | Extract<Matches, {
    catchAll: true;
}>["key"] : Extract<Matches, {
    exact: true;
}>["key"];

/**
 * @link https://github.com/remix-run/remix/blob/2248669ed59fd716e267ea41df5d665d4781f4a9/packages/remix-server-runtime/serialize.ts
 */
type JsonPrimitive = string | number | boolean | string | number | boolean | null;
type NonJsonPrimitive = undefined | Function | symbol;
type IsAny<T> = 0 extends 1 & T ? true : false;
type FilterKeys<TObj extends object, TFilter> = {
    [TKey in keyof TObj]: TObj[TKey] extends TFilter ? TKey : never;
}[keyof TObj];
type Serialize<T> = IsAny<T> extends true ? any : T extends JsonPrimitive | undefined ? T : T extends Map<any, any> | Set<any> ? Record<string, never> : T extends NonJsonPrimitive ? never : T extends {
    toJSON(): infer U;
} ? U : T extends [] ? [] : T extends [unknown, ...unknown[]] ? SerializeTuple<T> : T extends ReadonlyArray<infer U> ? (U extends NonJsonPrimitive ? null : Serialize<U>)[] : T extends object ? SerializeObject<T> : never;
/** JSON serialize [tuples](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types) */
type SerializeTuple<T extends [unknown, ...unknown[]]> = {
    [k in keyof T]: T[k] extends NonJsonPrimitive ? null : Serialize<T[k]>;
};
/** JSON serialize objects (not including arrays) and classes */
type SerializeObject<T extends object> = {
    [k in keyof Omit<T, FilterKeys<T, NonJsonPrimitive>>]: Serialize<T[k]>;
};
/**
 * @see https://github.com/ianstormtaylor/superstruct/blob/7973400cd04d8ad92bbdc2b6f35acbfb3c934079/src/utils.ts#L323-L325
 */
type Simplify<TType> = TType extends any[] | Date ? TType : {
    [K in keyof TType]: Simplify<TType[K]>;
};

interface NitroStaticBuildFlags {
    _asyncContext?: boolean;
    _websocket?: boolean;
    _tasks?: boolean;
    dev?: boolean;
    client?: boolean;
    nitro?: boolean;
    baseURL?: string;
    prerender?: boolean;
    preset?: NitroOptions["preset"];
    server?: boolean;
    versions?: {
        nitro?: string;
    };
}
declare global {
    namespace NodeJS {
        interface Process extends NitroStaticBuildFlags {
        }
    }
    interface ImportMeta extends NitroStaticBuildFlags {
    }
}
declare global {
    const defineNitroConfig: (config: NitroConfig) => NitroConfig;
    const defineNitroModule: (definition: NitroModule) => NitroModule;
}

type H3EventFetch = (request: NitroFetchRequest, init?: RequestInit) => Promise<Response>;
type H3Event$Fetch = Base$Fetch<unknown, NitroFetchRequest>;
declare module "h3" {
    interface H3Event {
        /** @experimental Calls fetch with same context and request headers */
        fetch: H3EventFetch;
        /** @experimental Calls fetch with same context and request headers */
        $fetch: H3Event$Fetch;
        waitUntil: (promise: Promise<unknown>) => void;
        /** @experimental */
        captureError: CaptureError$1;
    }
    interface H3Context {
        nitro: {
            _waitUntilPromises?: Promise<unknown>[];
            /** @experimental */
            errors: {
                error?: Error;
                context: CapturedErrorContext$1;
            }[];
        };
        cache: {
            options: CacheOptions;
        };
    }
}

export { NitroConfig, NitroModule, NitroOptions };
export type { $Fetch, AssetMeta, AvailableRouterMethod, Base$Fetch, CaptureError, CapturedErrorContext, ExtractedRouteMethod, H3Event$Fetch, H3EventFetch, InternalApi, MatchedRoutes, MiddlewareOf, NitroApp, NitroAppPlugin, NitroAsyncContext, NitroFetchOptions, NitroFetchRequest, NitroRuntimeHooks, NitroStaticBuildFlags, PublicAsset, RenderContext, RenderHandler, RenderResponse, Serialize, SerializeObject, SerializeTuple, Simplify, Task, TaskContext, TaskEvent, TaskMeta, TaskPayload, TaskResult, TaskRunnerOptions, TypedInternalResponse };
