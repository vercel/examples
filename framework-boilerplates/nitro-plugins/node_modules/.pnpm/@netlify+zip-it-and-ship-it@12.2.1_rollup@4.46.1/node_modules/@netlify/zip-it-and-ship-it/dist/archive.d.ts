import { Buffer } from 'buffer';
import { Stats } from 'fs';
import { Writable } from 'stream';
import { Archiver } from 'archiver';
import { ObjectValues } from './types/utils.js';
export { Archiver as ZipArchive } from 'archiver';
export declare const ARCHIVE_FORMAT: {
    readonly NONE: "none";
    readonly ZIP: "zip";
};
export type ArchiveFormat = ObjectValues<typeof ARCHIVE_FORMAT>;
export declare const startZip: (destPath: string) => {
    archive: Archiver;
    output: Writable;
};
export declare const addZipFile: (archive: Archiver, file: string, name: string, stat: Stats) => void;
export declare const addZipContent: (archive: Archiver, content: Buffer | string, name: string) => void;
export declare const endZip: (archive: Archiver, output: Writable) => Promise<void>;
