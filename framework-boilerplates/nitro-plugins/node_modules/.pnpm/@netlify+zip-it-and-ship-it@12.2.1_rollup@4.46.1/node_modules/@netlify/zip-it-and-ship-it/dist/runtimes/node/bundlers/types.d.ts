import type { Message } from 'esbuild';
import { z } from 'zod';
import type { FunctionConfig } from '../../../config.js';
import type { FeatureFlags } from '../../../feature_flags.js';
import type { FunctionSource } from '../../../function.js';
import type { RuntimeCache } from '../../../utils/cache.js';
import { Logger } from '../../../utils/logger.js';
import type { ModuleFormat } from '../utils/module_format.js';
export declare const NODE_BUNDLER: {
    readonly ESBUILD: "esbuild";
    readonly ESBUILD_ZISI: "esbuild_zisi";
    readonly NFT: "nft";
    readonly ZISI: "zisi";
    readonly NONE: "none";
};
export declare const nodeBundler: z.ZodNativeEnum<{
    readonly ESBUILD: "esbuild";
    readonly ESBUILD_ZISI: "esbuild_zisi";
    readonly NFT: "nft";
    readonly ZISI: "zisi";
    readonly NONE: "none";
}>;
export type NodeBundlerName = z.infer<typeof nodeBundler>;
type BundlerWarning = Message;
type CleanupFunction = () => Promise<void>;
export type NativeNodeModules = Record<string, Record<string, string | undefined>>;
export type BundleFunction = (args: {
    basePath?: string;
    cache: RuntimeCache;
    config: FunctionConfig;
    featureFlags: FeatureFlags;
    logger: Logger;
    pluginsModulesPath?: string;
    repositoryRoot?: string;
    runtimeAPIVersion: number;
} & FunctionSource) => Promise<{
    aliases?: Map<string, string>;
    rewrites?: Map<string, string>;
    basePath: string;
    bundlerWarnings?: BundlerWarning[];
    cleanupFunction?: CleanupFunction;
    includedFiles: string[];
    inputs: string[];
    mainFile: string;
    moduleFormat: ModuleFormat;
    nativeNodeModules?: NativeNodeModules;
    srcFiles: string[];
}>;
export type GetSrcFilesFunction = (args: {
    basePath?: string;
    config: FunctionConfig;
    featureFlags: FeatureFlags;
    pluginsModulesPath?: string;
    repositoryRoot?: string;
} & FunctionSource) => Promise<{
    srcFiles: string[];
    includedFiles: string[];
}>;
export interface NodeBundler {
    bundle: BundleFunction;
    getSrcFiles: GetSrcFilesFunction;
}
export {};
