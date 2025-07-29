import type { Stats } from 'fs';
export declare const getTreeFiles: (srcPath: string, stat: Stats) => Promise<string[]>;
