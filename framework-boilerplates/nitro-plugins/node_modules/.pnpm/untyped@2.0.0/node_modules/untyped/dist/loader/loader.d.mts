import { JitiOptions } from 'jiti';
import { S as Schema } from '../shared/untyped.kR35CG5k.mjs';

interface LoaderOptions {
    jiti?: JitiOptions;
    defaults?: Record<string, any>;
    ignoreDefaults?: boolean;
    cwd?: string;
}
declare function loadSchema(entryPath: string, options?: LoaderOptions): Promise<Schema>;

export { type LoaderOptions, loadSchema };
