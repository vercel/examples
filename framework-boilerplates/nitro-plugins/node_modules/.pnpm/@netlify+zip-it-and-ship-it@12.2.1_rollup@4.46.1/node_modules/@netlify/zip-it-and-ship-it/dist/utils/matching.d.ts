import originalGlob from 'fast-glob';
import { type MinimatchOptions } from 'minimatch';
/**
 * Both glob and minimatch only support unix style slashes in patterns
 * For this reason we wrap them and ensure all patterns are always unixified
 * We use `normalize-path` here instead of `unixify` because we do not want to remove drive letters
 */
export declare const glob: (pattern: string, options: originalGlob.Options) => Promise<string[]>;
export declare const minimatch: (target: string, pattern: string, options?: MinimatchOptions) => boolean;
