import type { Stats } from 'fs';
import { Runtime } from './runtimes/runtime.js';
export declare const zipBinary: ({ destPath, filename, runtime, srcPath, stat, }: {
    destPath: string;
    filename: string;
    runtime: Runtime;
    srcPath: string;
    stat: Stats;
}) => Promise<void>;
