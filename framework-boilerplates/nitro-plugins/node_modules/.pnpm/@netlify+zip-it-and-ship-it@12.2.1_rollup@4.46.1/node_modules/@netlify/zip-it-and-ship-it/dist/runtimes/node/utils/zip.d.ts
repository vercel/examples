import { ArchiveFormat } from '../../../archive.js';
import type { FeatureFlags } from '../../../feature_flags.js';
import type { RuntimeCache } from '../../../utils/cache.js';
import { ModuleFormat } from './module_format.js';
interface ZipNodeParameters {
    aliases?: Map<string, string>;
    basePath: string;
    branch?: string;
    cache: RuntimeCache;
    destFolder: string;
    extension: string;
    featureFlags: FeatureFlags;
    filename: string;
    mainFile: string;
    moduleFormat: ModuleFormat;
    name: string;
    repositoryRoot?: string;
    rewrites?: Map<string, string>;
    runtimeAPIVersion: number;
    srcFiles: string[];
    generator?: string;
}
interface ZipNodeJsResult {
    bootstrapVersion?: string;
    entryFilename: string;
    path: string;
}
export declare const zipNodeJs: ({ archiveFormat, ...options }: ZipNodeParameters & {
    archiveFormat: ArchiveFormat;
}) => Promise<ZipNodeJsResult>;
export {};
