import type { FeatureFlags } from '../../../feature_flags.js';
import { ModuleFormat } from './module_format.js';
export declare const ENTRY_FILE_NAME = "___netlify-entry-point";
export declare const BOOTSTRAP_FILE_NAME = "___netlify-bootstrap.mjs";
export declare const BOOTSTRAP_VERSION_FILE_NAME = "___netlify-bootstrap-version";
export declare const METADATA_FILE_NAME = "___netlify-metadata.json";
export declare const TELEMETRY_FILE_NAME = "___netlify-telemetry.mjs";
export interface EntryFile {
    contents: string;
    filename: string;
}
/**
 * A minimal implementation of kebab-case.
 * It is used to transform the generator name into a service name for the telemetry file.
 * As DataDog has a special handling for the service name, we need to make sure it is kebab-case.
 */
export declare const kebabCase: (input: string) => string;
export declare const isNamedLikeEntryFile: (file: string, { basePath, filename, runtimeAPIVersion, }: {
    basePath: string;
    filename: string;
    runtimeAPIVersion: number;
}) => boolean;
export declare const conflictsWithEntryFile: (srcFiles: string[], { basePath, extension, filename, mainFile, runtimeAPIVersion, }: {
    basePath: string;
    extension: string;
    filename: string;
    mainFile: string;
    runtimeAPIVersion: number;
}) => boolean;
export declare const getTelemetryFile: (generator?: string) => EntryFile;
export declare const getEntryFile: ({ commonPrefix, featureFlags, filename, mainFile, moduleFormat, userNamespace, runtimeAPIVersion, }: {
    commonPrefix: string;
    featureFlags: FeatureFlags;
    filename: string;
    mainFile: string;
    moduleFormat: ModuleFormat;
    userNamespace: string;
    runtimeAPIVersion: number;
}) => EntryFile;
