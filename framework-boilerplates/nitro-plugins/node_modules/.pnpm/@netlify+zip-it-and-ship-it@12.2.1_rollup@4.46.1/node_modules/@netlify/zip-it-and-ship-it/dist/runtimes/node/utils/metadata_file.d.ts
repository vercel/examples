export interface MetadataFile {
    bootstrap_version?: string;
    branch?: string;
    version: number;
}
export declare const getMetadataFile: (bootstrapVersion?: string, branch?: string) => MetadataFile;
