export declare const filterExcludedPaths: (paths: string[], excludePattern?: string[]) => string[];
export declare const getPathsOfIncludedFiles: (includedFiles: string[], basePath?: string) => Promise<{
    excludePatterns: string[];
    paths: string[];
}>;
