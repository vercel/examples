import { Config } from '../config.js';
import { FeatureFlags } from '../feature_flags.js';
import { FunctionSource } from '../function.js';
import type { RuntimeCache } from '../utils/cache.js';
type FunctionMap = Map<string, FunctionSource>;
/**
 * Gets a list of functions found in a list of paths.
 */
export declare const getFunctionsFromPaths: (paths: string[], { cache, config, configFileDirectories, dedupe, featureFlags, }: {
    cache: RuntimeCache;
    config?: Config;
    configFileDirectories?: string[];
    dedupe?: boolean;
    featureFlags?: FeatureFlags;
}) => Promise<FunctionMap>;
/**
 * Gets a list of functions found in a list of paths.
 */
export declare const getFunctionFromPath: (path: string, { cache, config, configFileDirectories, featureFlags, }: {
    cache: RuntimeCache;
    config?: Config;
    configFileDirectories?: string[];
    featureFlags?: FeatureFlags;
}) => Promise<FunctionSource | undefined>;
export {};
