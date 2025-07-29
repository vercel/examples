import { FeatureFlags } from '../../../../feature_flags.js';
import { ModuleFormat } from '../../utils/module_format.js';
declare const versionMap: {
    readonly 14: "node14";
    readonly 16: "node16";
    readonly 18: "node18";
    readonly 20: "node20";
    readonly 22: "node22";
};
type VersionValues = (typeof versionMap)[keyof typeof versionMap];
declare const getBundlerTarget: (suppliedVersion?: string) => VersionValues;
declare const getModuleFormat: ({ srcDir, featureFlags, extension, runtimeAPIVersion, configVersion, }: {
    srcDir: string;
    featureFlags: FeatureFlags;
    extension: string;
    runtimeAPIVersion: number;
    configVersion?: string;
}) => Promise<{
    includedFiles: string[];
    moduleFormat: ModuleFormat;
}>;
export { getBundlerTarget, getModuleFormat };
