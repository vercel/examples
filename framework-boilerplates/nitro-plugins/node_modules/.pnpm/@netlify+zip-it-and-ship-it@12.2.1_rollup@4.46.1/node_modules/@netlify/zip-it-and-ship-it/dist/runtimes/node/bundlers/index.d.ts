import { FunctionConfig } from '../../../config.js';
import { FeatureFlags } from '../../../feature_flags.js';
import { NodeBundler, NodeBundlerName } from './types.js';
export declare const getBundler: (name: NodeBundlerName) => NodeBundler;
export declare const getBundlerName: ({ config: { nodeBundler }, extension, featureFlags, mainFile, runtimeAPIVersion, }: {
    config: FunctionConfig;
    extension: string;
    featureFlags: FeatureFlags;
    mainFile: string;
    runtimeAPIVersion: number;
}) => Promise<NodeBundlerName>;
