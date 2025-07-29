import { Config } from './config.js';
import { FeatureFlags } from './feature_flags.js';
import { ModuleFormat } from './runtimes/node/utils/module_format.js';
import { RuntimeName } from './runtimes/runtime.js';
import type { ExtendedRoute, Route } from './utils/routes.js';
export { Config, FunctionConfig } from './config.js';
export { zipFunction, zipFunctions, ZipFunctionOptions, ZipFunctionsOptions } from './zip.js';
export { ArchiveFormat, ARCHIVE_FORMAT } from './archive.js';
export type { TrafficRules } from './rate_limit.js';
export type { ExtendedRoute, Route } from './utils/routes.js';
export { NodeBundlerName, NODE_BUNDLER } from './runtimes/node/bundlers/types.js';
export { RuntimeName, RUNTIME } from './runtimes/runtime.js';
export { ModuleFormat, MODULE_FORMAT } from './runtimes/node/utils/module_format.js';
export { Manifest } from './manifest.js';
export { FunctionResult } from './utils/format_result.js';
export interface ListedFunction {
    name: string;
    mainFile: string;
    runtime: RuntimeName;
    extension: string;
    runtimeAPIVersion?: number;
    schedule?: string;
    displayName?: string;
    generator?: string;
    timeout?: number;
    inputModuleFormat?: ModuleFormat;
    excludedRoutes?: Route[];
    routes?: ExtendedRoute[];
}
type ListedFunctionFile = ListedFunction & {
    srcFile: string;
};
interface ListFunctionsOptions {
    basePath?: string;
    config?: Config;
    configFileDirectories?: string[];
    featureFlags?: FeatureFlags;
    parseISC?: boolean;
}
export declare const listFunctions: (relativeSrcFolders: string | string[], { featureFlags: inputFeatureFlags, config, configFileDirectories, parseISC }?: ListFunctionsOptions) => Promise<ListedFunction[]>;
interface ListFunctionOptions {
    basePath?: string;
    config?: Config;
    configFileDirectories?: string[];
    featureFlags?: FeatureFlags;
    parseISC?: boolean;
}
export declare const listFunction: (path: string, { featureFlags: inputFeatureFlags, config, configFileDirectories, parseISC }?: ListFunctionOptions) => Promise<ListedFunction | undefined>;
export declare const listFunctionsFiles: (relativeSrcFolders: string | string[], { basePath, config, configFileDirectories, featureFlags: inputFeatureFlags, parseISC, }?: ListFunctionsOptions) => Promise<ListedFunctionFile[]>;
