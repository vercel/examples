import type { Stats } from 'fs';
/**
 * Takes a function path and, if it's a directory, returns a list of all the
 * nested files, recursively, except `node_modules` and junk files.
 */
export declare const getSideFiles: (functionPath: string, stat: Stats) => Promise<string[]>;
