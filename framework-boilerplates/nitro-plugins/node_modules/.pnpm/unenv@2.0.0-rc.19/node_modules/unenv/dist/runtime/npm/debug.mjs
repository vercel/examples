// https://www.npmjs.com/package/debug
const noop = () => {};
const debug = () => console.debug;
export const coerce = noop;
export const disable = noop;
export const enable = noop;
export const enabled = noop;
export const extend = debug;
export const humanize = noop;
export const destroy = noop;
export const init = noop;
export const log = console.debug;
export const formatArgs = noop;
export const save = noop;
export const load = noop;
export const useColors = noop;
export const colors = [];
export const inspectOpts = {};
export const names = [];
export const skips = [];
export const formatters = {};
export const selectColors = noop;
Object.assign(debug, {
	default: debug,
	coerce,
	disable,
	enable,
	enabled,
	extend,
	humanize,
	destroy,
	init,
	log,
	formatArgs,
	save,
	load,
	useColors,
	colors,
	inspectOpts,
	names,
	skips,
	formatters,
	selectColors
});
export default debug;
