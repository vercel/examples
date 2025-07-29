import type { FunctionConfig } from '../../../../config.js';
export declare const getExternalAndIgnoredModulesFromSpecialCases: ({ config, srcDir, }: {
    config: FunctionConfig;
    srcDir: string;
}) => Promise<{
    externalModules: string[];
    ignoredModules: string[];
}>;
