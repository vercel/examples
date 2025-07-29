import { AppOptions } from 'h3';
import { NitroConfig, LoadConfigOptions, Nitro, NitroDevServer, NitroOptions, TaskEvent, TaskRunnerOptions, NitroRouteConfig, NitroOpenAPIConfig, CaptureError, RenderContext, RenderResponse } from 'nitropack/types';
export { $Fetch, AppConfig, AvailableRouterMethod, CacheEntry, CacheOptions, CachedEventHandlerOptions, CompressOptions, DatabaseConnectionConfig, DatabaseConnectionConfigs, DatabaseConnectionName, DevServerOptions, ExtractedRouteMethod, H3Event$Fetch, H3EventFetch, InternalApi, LoadConfigOptions, MatchedRoutes, MiddlewareOf, Nitro, NitroApp, NitroAppPlugin, NitroBuildInfo, NitroConfig, NitroDevEventHandler, NitroDevServer, NitroDynamicConfig, NitroErrorHandler, NitroEventHandler, NitroFetchOptions, NitroFetchRequest, NitroFrameworkInfo, NitroHooks, NitroModule, NitroModuleInput, NitroOptions, NitroPreset, NitroRouteConfig, NitroRouteRules, NitroStaticBuildFlags, NitroTypes, NitroWorker, PrerenderGenerateRoute, PrerenderRoute, PublicAssetDir, RenderHandler, RenderResponse, ResponseCacheEntry, Serialize, SerializeObject, SerializeTuple, ServerAssetDir, Simplify, StorageMounts, Task, TaskContext, TaskEvent, TaskMeta, TaskPayload, TaskResult, TypedInternalResponse } from 'nitropack/types';
import { Nitro as Nitro$1 } from 'nitropack';
export { defineNitroPreset } from 'nitropack/kit';
export { runtimeDependencies as nitroRuntimeDependencies } from 'nitropack/runtime/meta';

declare function createNitro(config?: NitroConfig, opts?: LoadConfigOptions): Promise<Nitro>;

declare function prerender(nitro: Nitro): Promise<void>;

declare function createDevServer(nitro: Nitro): NitroDevServer;

declare function loadOptions(configOverrides?: NitroConfig, opts?: LoadConfigOptions): Promise<NitroOptions>;

/** @experimental */
declare function runTask(taskEvent: TaskEvent, opts?: TaskRunnerOptions): Promise<{
    result: unknown;
}>;
/** @experimental */
declare function listTasks(opts?: TaskRunnerOptions): Promise<Record<string, {
    meta: {
        description: string;
    };
}>>;

declare function build(nitro: Nitro): Promise<void>;

declare function copyPublicAssets(nitro: Nitro): Promise<void>;

declare function prepare(nitro: Nitro$1): Promise<void>;

declare function writeTypes(nitro: Nitro): Promise<void>;

declare const GLOB_SCAN_PATTERN = "**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}";
type MatchedMethodSuffix = "connect" | "delete" | "get" | "head" | "options" | "patch" | "post" | "put" | "trace";
type MatchedEnvSuffix = "dev" | "prod" | "prerender";
declare function scanHandlers(nitro: Nitro): Promise<{
    handler: string;
    lazy: boolean;
    middleware: boolean;
    route: string;
    method: MatchedMethodSuffix | undefined;
    env: MatchedEnvSuffix | undefined;
}[]>;
declare function scanMiddleware(nitro: Nitro): Promise<{
    middleware: boolean;
    handler: string;
}[]>;
declare function scanServerRoutes(nitro: Nitro, dir: string, prefix?: string): Promise<{
    handler: string;
    lazy: boolean;
    middleware: boolean;
    route: string;
    method: MatchedMethodSuffix | undefined;
    env: MatchedEnvSuffix | undefined;
}[]>;
declare function scanPlugins(nitro: Nitro): Promise<string[]>;
declare function scanTasks(nitro: Nitro): Promise<{
    name: string;
    handler: string;
}[]>;
declare function scanModules(nitro: Nitro): Promise<string[]>;

/**
 * @deprecated Please import `defineNitroConfig` from nitropack/config instead
 */
declare function defineNitroConfig(config: NitroConfig): NitroConfig;

/** @deprecated Use `NitroRuntimeConfig` from `nitropack/types` */
interface NitroRuntimeConfig {
    app: NitroRuntimeConfigApp;
    nitro: {
        envPrefix?: string;
        envExpansion?: boolean;
        routeRules?: {
            [path: string]: NitroRouteConfig;
        };
        openAPI?: NitroOpenAPIConfig;
    };
    [key: string]: any;
}
/** @deprecated Use `NitroRuntimeHooks` from `nitropack/types` */
interface NitroRuntimeHooks {
    close: () => void;
    error: CaptureError;
    request: NonNullable<AppOptions["onRequest"]>;
    beforeResponse: NonNullable<AppOptions["onBeforeResponse"]>;
    afterResponse: NonNullable<AppOptions["onAfterResponse"]>;
    "render:before": (context: RenderContext) => void;
    "render:response": (response: Partial<RenderResponse>, context: RenderContext) => void;
}
/** @deprecated Use `NitroRuntimeConfigApp` from `nitropack/types` */
interface NitroRuntimeConfigApp {
    baseURL: string;
    [key: string]: any;
}

export { GLOB_SCAN_PATTERN, build, copyPublicAssets, createDevServer, createNitro, defineNitroConfig, listTasks, loadOptions, prepare, prerender, runTask, scanHandlers, scanMiddleware, scanModules, scanPlugins, scanServerRoutes, scanTasks, writeTypes };
export type { NitroRuntimeConfig, NitroRuntimeConfigApp, NitroRuntimeHooks };
