import { notImplemented } from "../_internal/utils.mjs";
import { basename, dirname, extname, format, isAbsolute, join, normalize, parse, relative, resolve, toNamespacedPath } from "pathe";
export { basename, dirname, extname, format, isAbsolute, join, normalize, parse, relative, resolve, toNamespacedPath } from "pathe";
export const sep = "/";
export const delimiter = ":";
const _pathModule = {
	sep,
	delimiter,
	basename,
	dirname,
	extname,
	format,
	isAbsolute,
	join,
	normalize,
	parse,
	relative,
	resolve,
	toNamespacedPath,
	posix: undefined,
	win32: undefined,
	_makeLong: (path) => path,
	matchesGlob: /* @__PURE__ */ notImplemented(`path.matchesGlob`)
};
_pathModule.posix = _pathModule;
_pathModule.win32 = _pathModule;
export const posix = _pathModule;
export const win32 = _pathModule;
export const _makeLong = _pathModule._makeLong;
export const matchesGlob = _pathModule.matchesGlob;
export default _pathModule;
