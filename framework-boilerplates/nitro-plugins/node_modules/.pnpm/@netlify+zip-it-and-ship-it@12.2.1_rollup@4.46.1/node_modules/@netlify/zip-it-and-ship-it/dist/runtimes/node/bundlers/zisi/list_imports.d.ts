import { FeatureFlags } from '../../../../feature_flags.js';
export declare const listImports: ({ featureFlags, ...args }: {
    featureFlags: FeatureFlags;
    functionName: string;
    path: string;
}) => Promise<string[]>;
