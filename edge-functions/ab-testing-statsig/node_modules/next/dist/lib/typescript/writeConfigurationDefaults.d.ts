export declare function getRequiredConfiguration(ts: typeof import('typescript')): Partial<import('typescript').CompilerOptions>;
export declare function writeConfigurationDefaults(ts: typeof import('typescript'), tsConfigPath: string, isFirstTimeSetup: boolean, isAppDirEnabled: boolean): Promise<void>;
