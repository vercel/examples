import type { ArgumentPlaceholder, Expression, SpreadElement, JSXNamespacedName } from '@babel/types';
import { z } from 'zod';
import { FunctionConfig } from '../../../config.js';
import { InvocationMode } from '../../../function.js';
import { ExtendedRoute, Route } from '../../../utils/routes.js';
import type { ModuleFormat } from '../utils/module_format.js';
export declare const IN_SOURCE_CONFIG_MODULE = "@netlify/functions";
export interface StaticAnalysisResult {
    config: InSourceConfig;
    excludedRoutes?: Route[];
    inputModuleFormat?: ModuleFormat;
    invocationMode?: InvocationMode;
    routes?: ExtendedRoute[];
    runtimeAPIVersion?: number;
}
interface FindISCDeclarationsOptions {
    functionName: string;
}
declare const httpMethod: z.ZodEnum<["GET", "POST", "PUT", "PATCH", "OPTIONS", "DELETE", "HEAD"]>;
declare const httpMethods: z.ZodEffects<z.ZodEnum<["GET", "POST", "PUT", "PATCH", "OPTIONS", "DELETE", "HEAD"]>, "GET" | "POST" | "PUT" | "PATCH" | "OPTIONS" | "DELETE" | "HEAD", unknown>;
export type HttpMethod = z.infer<typeof httpMethod>;
export type HttpMethods = z.infer<typeof httpMethods>;
export declare const inSourceConfig: z.ZodObject<Pick<{
    externalNodeModules: z.ZodCatch<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    generator: z.ZodCatch<z.ZodOptional<z.ZodString>>;
    includedFiles: z.ZodCatch<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    includedFilesBasePath: z.ZodCatch<z.ZodOptional<z.ZodString>>;
    ignoredNodeModules: z.ZodCatch<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    name: z.ZodCatch<z.ZodOptional<z.ZodString>>;
    nodeBundler: z.ZodCatch<z.ZodOptional<z.ZodNativeEnum<{
        readonly ESBUILD: "esbuild";
        readonly ESBUILD_ZISI: "esbuild_zisi";
        readonly NFT: "nft";
        readonly ZISI: "zisi";
        readonly NONE: "none";
    }>>>;
    nodeSourcemap: z.ZodCatch<z.ZodOptional<z.ZodBoolean>>;
    nodeVersion: z.ZodCatch<z.ZodOptional<z.ZodString>>;
    rustTargetDirectory: z.ZodCatch<z.ZodOptional<z.ZodString>>;
    schedule: z.ZodCatch<z.ZodOptional<z.ZodString>>;
    timeout: z.ZodCatch<z.ZodOptional<z.ZodNumber>>;
    zipGo: z.ZodCatch<z.ZodOptional<z.ZodBoolean>>;
    nodeModuleFormat: z.ZodCatch<z.ZodOptional<z.ZodNativeEnum<{
        readonly COMMONJS: "cjs";
        readonly ESM: "esm";
    }>>>;
}, "name" | "externalNodeModules" | "generator" | "includedFiles" | "ignoredNodeModules" | "nodeBundler" | "nodeVersion" | "schedule" | "timeout"> & {
    method: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodEffects<z.ZodEnum<["GET", "POST", "PUT", "PATCH", "OPTIONS", "DELETE", "HEAD"]>, "GET" | "POST" | "PUT" | "PATCH" | "OPTIONS" | "DELETE" | "HEAD", unknown>, z.ZodArray<z.ZodEffects<z.ZodEnum<["GET", "POST", "PUT", "PATCH", "OPTIONS", "DELETE", "HEAD"]>, "GET" | "POST" | "PUT" | "PATCH" | "OPTIONS" | "DELETE" | "HEAD", unknown>, "many">]>, ("GET" | "POST" | "PUT" | "PATCH" | "OPTIONS" | "DELETE" | "HEAD")[], unknown>>;
    path: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>, string[], string | string[]>>;
    excludedPath: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>, string[], string | string[]>>;
    preferStatic: z.ZodCatch<z.ZodOptional<z.ZodBoolean>>;
    rateLimit: z.ZodCatch<z.ZodOptional<z.ZodObject<{
        action: z.ZodOptional<z.ZodEnum<["rate_limit", "rewrite"]>>;
        aggregateBy: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["domain", "ip"]>, z.ZodArray<z.ZodEnum<["domain", "ip"]>, "many">]>>;
        algorithm: z.ZodOptional<z.ZodEnum<["sliding_window"]>>;
    } & {
        windowLimit: z.ZodNumber;
        windowSize: z.ZodNumber;
    } & {
        to: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        windowLimit: number;
        windowSize: number;
        to?: string | undefined;
        action?: "rate_limit" | "rewrite" | undefined;
        aggregateBy?: "domain" | "ip" | ("domain" | "ip")[] | undefined;
        algorithm?: "sliding_window" | undefined;
    }, {
        windowLimit: number;
        windowSize: number;
        to?: string | undefined;
        action?: "rate_limit" | "rewrite" | undefined;
        aggregateBy?: "domain" | "ip" | ("domain" | "ip")[] | undefined;
        algorithm?: "sliding_window" | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    path?: string[] | undefined;
    externalNodeModules?: string[] | undefined;
    generator?: string | undefined;
    includedFiles?: string[] | undefined;
    ignoredNodeModules?: string[] | undefined;
    nodeBundler?: "none" | "esbuild" | "esbuild_zisi" | "nft" | "zisi" | undefined;
    nodeVersion?: string | undefined;
    schedule?: string | undefined;
    timeout?: number | undefined;
    method?: ("GET" | "POST" | "PUT" | "PATCH" | "OPTIONS" | "DELETE" | "HEAD")[] | undefined;
    excludedPath?: string[] | undefined;
    preferStatic?: boolean | undefined;
    rateLimit?: {
        windowLimit: number;
        windowSize: number;
        to?: string | undefined;
        action?: "rate_limit" | "rewrite" | undefined;
        aggregateBy?: "domain" | "ip" | ("domain" | "ip")[] | undefined;
        algorithm?: "sliding_window" | undefined;
    } | undefined;
}, {
    name?: unknown;
    path?: string | string[] | undefined;
    externalNodeModules?: unknown;
    generator?: unknown;
    includedFiles?: unknown;
    ignoredNodeModules?: unknown;
    nodeBundler?: unknown;
    nodeVersion?: unknown;
    schedule?: unknown;
    timeout?: unknown;
    method?: unknown;
    excludedPath?: string | string[] | undefined;
    preferStatic?: unknown;
    rateLimit?: unknown;
}>;
export type InSourceConfig = z.infer<typeof inSourceConfig>;
/**
 * Loads a file at a given path, parses it into an AST, and returns a series of
 * data points, such as in-source configuration properties and other metadata.
 */
export declare const parseFile: (sourcePath: string, { functionName }: FindISCDeclarationsOptions) => Promise<StaticAnalysisResult>;
/**
 * Takes a JS/TS source as a string, parses it into an AST, and returns a
 * series of data points, such as in-source configuration properties and
 * other metadata.
 */
export declare const parseSource: (source: string, { functionName }: FindISCDeclarationsOptions) => StaticAnalysisResult;
export declare const augmentFunctionConfig: (mainFile: string, tomlConfig: FunctionConfig, inSourceConfig?: InSourceConfig) => {
    name?: string | undefined;
    externalNodeModules?: string[] | undefined;
    generator?: string | undefined;
    includedFiles?: string[] | undefined;
    includedFilesBasePath?: string | undefined;
    ignoredNodeModules?: string[] | undefined;
    nodeBundler?: "none" | "esbuild" | "esbuild_zisi" | "nft" | "zisi" | undefined;
    nodeSourcemap?: boolean | undefined;
    nodeVersion?: string | undefined;
    rustTargetDirectory?: string | undefined;
    schedule?: string | undefined;
    timeout?: number | undefined;
    zipGo?: boolean | undefined;
    nodeModuleFormat?: "cjs" | "esm" | undefined;
} & {
    name?: string | undefined;
    path?: string[] | undefined;
    externalNodeModules?: string[] | undefined;
    generator?: string | undefined;
    includedFiles?: string[] | undefined;
    ignoredNodeModules?: string[] | undefined;
    nodeBundler?: "none" | "esbuild" | "esbuild_zisi" | "nft" | "zisi" | undefined;
    nodeVersion?: string | undefined;
    schedule?: string | undefined;
    timeout?: number | undefined;
    method?: ("GET" | "POST" | "PUT" | "PATCH" | "OPTIONS" | "DELETE" | "HEAD")[] | undefined;
    excludedPath?: string[] | undefined;
    preferStatic?: boolean | undefined;
    rateLimit?: {
        windowLimit: number;
        windowSize: number;
        to?: string | undefined;
        action?: "rate_limit" | "rewrite" | undefined;
        aggregateBy?: "domain" | "ip" | ("domain" | "ip")[] | undefined;
        algorithm?: "sliding_window" | undefined;
    } | undefined;
};
export type ISCHandlerArg = ArgumentPlaceholder | Expression | SpreadElement | JSXNamespacedName;
export type ISCExportWithCallExpression = {
    type: 'call-expression';
    args: ISCHandlerArg[];
    local: string;
};
export type ISCExportWithObject = {
    type: 'object-expression';
    object: Record<string, unknown>;
};
export type ISCExportOther = {
    type: 'other';
};
export type ISCDefaultExport = {
    type: 'default';
};
export type ISCExport = ISCExportWithCallExpression | ISCExportWithObject | ISCExportOther | ISCDefaultExport;
export {};
