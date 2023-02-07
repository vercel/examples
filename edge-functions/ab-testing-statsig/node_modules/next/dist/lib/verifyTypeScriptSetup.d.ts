import { TypeCheckResult } from './typescript/runTypeCheck';
export declare function verifyTypeScriptSetup({ dir, cacheDir, intentDirs, tsconfigPath, typeCheckPreflight, disableStaticImages, isAppDirEnabled, }: {
    dir: string;
    cacheDir?: string;
    tsconfigPath: string;
    intentDirs: string[];
    typeCheckPreflight: boolean;
    disableStaticImages: boolean;
    isAppDirEnabled: boolean;
}): Promise<{
    result?: TypeCheckResult;
    version: string | null;
}>;
