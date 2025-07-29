import type { FunctionConfig } from '../../config.js';
import type { RuntimeCache } from '../../utils/cache.js';
export declare const build: ({ cache, config, name, srcDir, }: {
    cache: RuntimeCache;
    config: FunctionConfig;
    name: string;
    srcDir: string;
}) => Promise<{
    path: string;
    stat: import("fs").Stats;
}>;
