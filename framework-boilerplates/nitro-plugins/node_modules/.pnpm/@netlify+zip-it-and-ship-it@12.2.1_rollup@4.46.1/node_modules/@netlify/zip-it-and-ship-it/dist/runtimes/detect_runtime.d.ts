import { RuntimeName } from './runtime.js';
export declare const detectBinaryRuntime: ({ path }: {
    path: string;
}) => Promise<RuntimeName | undefined>;
