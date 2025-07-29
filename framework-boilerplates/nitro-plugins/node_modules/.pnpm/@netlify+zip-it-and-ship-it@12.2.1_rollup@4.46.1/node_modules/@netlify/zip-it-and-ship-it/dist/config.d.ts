import { z } from 'zod';
import { FunctionSource } from './function.js';
export declare const functionConfig: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
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
}, {
    name?: unknown;
    externalNodeModules?: unknown;
    generator?: unknown;
    includedFiles?: unknown;
    includedFilesBasePath?: unknown;
    ignoredNodeModules?: unknown;
    nodeBundler?: unknown;
    nodeSourcemap?: unknown;
    nodeVersion?: unknown;
    rustTargetDirectory?: unknown;
    schedule?: unknown;
    timeout?: unknown;
    zipGo?: unknown;
    nodeModuleFormat?: unknown;
}>;
type FunctionConfig = z.infer<typeof functionConfig>;
type GlobPattern = string;
type Config = Record<GlobPattern, FunctionConfig>;
type FunctionWithoutConfig = Omit<FunctionSource, 'config'>;
declare const getConfigForFunction: ({ config, configFileDirectories, func, }: {
    config?: Config;
    configFileDirectories?: string[];
    func: FunctionWithoutConfig;
}) => Promise<FunctionConfig>;
export { Config, FunctionConfig, FunctionWithoutConfig, getConfigForFunction };
