import type { FunctionConfig } from '../../../../config.js';
import { FeatureFlags } from '../../../../feature_flags.js';
export declare const ESBUILD_LOG_LIMIT = 10;
export declare const bundleJsFile: ({ additionalModulePaths, config, externalModules, featureFlags, ignoredModules, mainFile, name, srcDir, srcFile, runtimeAPIVersion, }: {
    additionalModulePaths?: string[];
    config: FunctionConfig;
    externalModules: string[];
    featureFlags: FeatureFlags;
    ignoredModules: string[];
    mainFile: string;
    name: string;
    srcDir: string;
    srcFile: string;
    runtimeAPIVersion: number;
}) => Promise<{
    additionalPaths: string[];
    bundlePaths: Map<string, string>;
    cleanTempFiles: () => Promise<void>;
    inputs: string[];
    moduleFormat: "cjs" | "esm";
    nativeNodeModules: {};
    outputExtension: import("../../utils/module_format.js").ModuleFileExtension;
    warnings: import("esbuild").Message[];
}>;
