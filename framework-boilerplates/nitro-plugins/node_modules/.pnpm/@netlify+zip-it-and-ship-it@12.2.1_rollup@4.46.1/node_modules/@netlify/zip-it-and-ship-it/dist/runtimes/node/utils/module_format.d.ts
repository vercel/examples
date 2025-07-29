import { z } from 'zod';
import type { FeatureFlags } from '../../../feature_flags.js';
import { ObjectValues } from '../../../types/utils.js';
export declare const tsExtensions: Set<string>;
export declare const MODULE_FORMAT: {
    readonly COMMONJS: "cjs";
    readonly ESM: "esm";
};
export declare const moduleFormat: z.ZodNativeEnum<{
    readonly COMMONJS: "cjs";
    readonly ESM: "esm";
}>;
export type ModuleFormat = z.infer<typeof moduleFormat>;
export declare const MODULE_FILE_EXTENSION: {
    readonly CJS: ".cjs";
    readonly CTS: ".cts";
    readonly JS: ".js";
    readonly MJS: ".mjs";
    readonly MTS: ".mts";
};
export type ModuleFileExtension = ObjectValues<typeof MODULE_FILE_EXTENSION>;
export declare const getFileExtensionForFormat: (moduleFormat: ModuleFormat, featureFlags: FeatureFlags, runtimeAPIVersion: number) => ModuleFileExtension;
