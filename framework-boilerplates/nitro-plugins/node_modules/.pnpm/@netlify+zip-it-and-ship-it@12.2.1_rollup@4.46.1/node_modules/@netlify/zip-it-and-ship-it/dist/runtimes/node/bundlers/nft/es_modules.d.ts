import { NodeFileTraceReasons } from '@vercel/nft';
import type { FunctionConfig } from '../../../../config.js';
import { FeatureFlags } from '../../../../feature_flags.js';
import type { RuntimeCache } from '../../../../utils/cache.js';
import { ModuleFormat } from '../../utils/module_format.js';
export declare const processESM: ({ basePath, cache, config, esmPaths, featureFlags, mainFile, reasons, name, runtimeAPIVersion, }: {
    basePath: string | undefined;
    cache: RuntimeCache;
    config: FunctionConfig;
    esmPaths: Set<string>;
    featureFlags: FeatureFlags;
    mainFile: string;
    reasons: NodeFileTraceReasons;
    name: string;
    runtimeAPIVersion: number;
}) => Promise<{
    rewrites?: Map<string, string>;
    moduleFormat: ModuleFormat;
}>;
