export interface PackageJson {
    name?: string;
    version?: string;
    dependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    peerDependenciesMeta?: Record<string, {
        optional?: boolean;
    }>;
    optionalDependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    files?: string[];
    gypfile?: boolean;
    binary?: boolean;
    type?: 'module' | 'commonjs';
}
export interface PackageJsonFile {
    contents: PackageJson;
    path: string;
}
export declare const getClosestPackageJson: (resolveDir: string, boundary?: string) => Promise<PackageJsonFile | null>;
export declare const getPackageJson: (srcDir: string) => Promise<PackageJson>;
export declare const getPackageJsonIfAvailable: (srcDir: string) => Promise<PackageJson>;
export declare const readPackageJson: (path: string) => Promise<PackageJson>;
export declare const sanitizePackageJson: (packageJson: Record<string, unknown>) => PackageJson;
