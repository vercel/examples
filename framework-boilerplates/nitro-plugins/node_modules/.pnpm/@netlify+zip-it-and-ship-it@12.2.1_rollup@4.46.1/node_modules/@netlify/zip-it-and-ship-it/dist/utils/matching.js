import originalGlob from 'fast-glob';
import { minimatch as minimatchFunction } from 'minimatch';
import normalizePath from 'normalize-path';
/**
 * Both glob and minimatch only support unix style slashes in patterns
 * For this reason we wrap them and ensure all patterns are always unixified
 * We use `normalize-path` here instead of `unixify` because we do not want to remove drive letters
 */
export const glob = function (pattern, options) {
    const normalizedIgnore = options.ignore?.map((expression) => normalizePath(expression));
    return originalGlob(normalizePath(pattern), { ...options, ignore: normalizedIgnore });
};
export const minimatch = function (target, pattern, options) {
    return minimatchFunction(target, normalizePath(pattern), options);
};
