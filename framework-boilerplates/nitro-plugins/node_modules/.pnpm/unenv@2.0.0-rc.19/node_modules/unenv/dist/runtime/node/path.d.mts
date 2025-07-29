// https://nodejs.org/api/path.html
// https://github.com/unjs/pathe
import type nodePath from "node:path";
export { basename, dirname, extname, format, isAbsolute, join, normalize, parse, relative, resolve, toNamespacedPath } from "pathe";
export declare const sep: "/";
export declare const delimiter: ":";
export declare const posix: typeof nodePath.posix;
export declare const win32: typeof nodePath.posix;
export declare const _makeLong: unknown;
export declare const matchesGlob: unknown;
declare const _default;
export default _default;
