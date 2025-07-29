import { builtinModules } from "node:module";
import { resolveAlias } from "pathe/utils";
import { createResolver } from "exsolve";

//#region package.json
var version = "2.0.0-rc.19";

//#endregion
//#region src/preset.ts
const nodeCompatAliases = {
	_http_agent: "unenv/mock/proxy-cjs",
	_http_client: "unenv/mock/proxy-cjs",
	_http_common: "unenv/mock/proxy-cjs",
	_http_incoming: "unenv/mock/proxy-cjs",
	_http_outgoing: "unenv/mock/proxy-cjs",
	_http_server: "unenv/mock/proxy-cjs",
	_stream_duplex: "unenv/mock/proxy-cjs",
	_stream_passthrough: "unenv/mock/proxy-cjs",
	_stream_readable: "unenv/mock/proxy-cjs",
	_stream_transform: "unenv/mock/proxy-cjs",
	_stream_wrap: "unenv/mock/proxy-cjs",
	_stream_writable: "unenv/mock/proxy-cjs",
	_tls_common: "unenv/mock/proxy-cjs",
	_tls_wrap: "unenv/mock/proxy-cjs",
	assert: "unenv/node/assert",
	"assert/strict": "unenv/node/assert/strict",
	async_hooks: "unenv/node/async_hooks",
	buffer: "unenv/node/buffer",
	child_process: "unenv/node/child_process",
	cluster: "unenv/node/cluster",
	console: "unenv/node/console",
	constants: "unenv/node/constants",
	crypto: "unenv/node/crypto",
	dgram: "unenv/node/dgram",
	diagnostics_channel: "unenv/node/diagnostics_channel",
	dns: "unenv/node/dns",
	"dns/promises": "unenv/node/dns/promises",
	domain: "unenv/node/domain",
	events: "unenv/node/events",
	fs: "unenv/node/fs",
	"fs/promises": "unenv/node/fs/promises",
	http: "unenv/node/http",
	http2: "unenv/node/http2",
	https: "unenv/node/https",
	inspector: "unenv/node/inspector",
	"inspector/promises": "unenv/node/inspector/promises",
	module: "unenv/node/module",
	net: "unenv/node/net",
	os: "unenv/node/os",
	path: "unenv/node/path",
	"path/posix": "unenv/node/path",
	"path/win32": "unenv/node/path",
	perf_hooks: "unenv/node/perf_hooks",
	process: "unenv/node/process",
	punycode: "unenv/node/punycode",
	querystring: "unenv/node/querystring",
	readline: "unenv/node/readline",
	"readline/promises": "unenv/node/readline/promises",
	repl: "unenv/node/repl",
	stream: "unenv/node/stream",
	"stream/consumers": "unenv/node/stream/consumers",
	"stream/promises": "unenv/node/stream/promises",
	"stream/web": "unenv/node/stream/web",
	string_decoder: "unenv/node/string_decoder",
	sys: "unenv/node/util",
	timers: "unenv/node/timers",
	"timers/promises": "unenv/node/timers/promises",
	tls: "unenv/node/tls",
	trace_events: "unenv/node/trace_events",
	tty: "unenv/node/tty",
	url: "unenv/node/url",
	util: "unenv/node/util",
	"util/types": "unenv/node/util/types",
	v8: "unenv/node/v8",
	vm: "unenv/node/vm",
	wasi: "unenv/node/wasi",
	worker_threads: "unenv/node/worker_threads",
	zlib: "unenv/node/zlib",
	"node:sqlite": "unenv/node/sqlite"
};
const nodeCompatInjects = {
	process: "unenv/node/process",
	global: "unenv/polyfill/globalthis",
	Buffer: ["node:buffer", "Buffer"],
	clearImmediate: ["node:timers", "clearImmediate"],
	setImmediate: ["node:timers", "setImmediate"]
};
const npmShims = {
	"cross-fetch": "unenv/npm/cross-fetch",
	debug: "unenv/npm/debug",
	fsevents: "unenv/npm/fsevents",
	inherits: "unenv/npm/inherits",
	"node-fetch": "unenv/npm/node-fetch",
	"node-fetch-native": "unenv/npm/node-fetch",
	"whatwg-url": "unenv/npm/whatwg-url/index",
	"whatwg-url/webidl2js-wrapper": "unenv/npm/whatwg-url/webidl2js-wrapper",
	"cross-fetch/polyfill": "unenv/mock/empty",
	"node-fetch-native/polyfill": "unenv/mock/empty",
	"isomorphic-fetch": "unenv/mock/empty"
};

//#endregion
//#region src/env.ts
/**
* Configure a target environment.
*/
function defineEnv(opts = {}) {
	const presets = [];
	presets.push(unenvPreset(opts));
	if (opts.presets) presets.push(...opts.presets);
	if (opts.overrides) presets.push(opts.overrides);
	if (opts.resolve) {
		for (const preset of presets) if (preset.meta?.url) resolvePaths(preset, [preset.meta.url], opts);
	}
	const env = mergePresets(...presets);
	if (opts.resolve) resolvePaths(env, presets.map((preset) => preset.meta?.url).filter((v) => v !== void 0), opts);
	return {
		env,
		presets
	};
}
function unenvPreset(opts) {
	const preset = {
		meta: {
			name: "unenv",
			version,
			url: import.meta.url
		},
		alias: {},
		inject: {},
		external: [],
		polyfill: []
	};
	if (opts.nodeCompat !== false) {
		Object.assign(preset.inject, nodeCompatInjects);
		Object.assign(preset.alias, { ...Object.fromEntries(Object.entries(nodeCompatAliases).flatMap(([from, to]) => {
			const aliases = from.startsWith("node:") ? [[from, to]] : [[from, to], [`node:${from}`, to]];
			return aliases;
		})) });
	}
	if (opts.npmShims) Object.assign(preset.alias, npmShims);
	return preset;
}
function resolvePaths(env, from, opts = {}) {
	if (!opts.resolve) return;
	const { resolveModulePath } = createResolver({ from: [
		...opts.resolve === true ? [] : opts.resolve.paths || [],
		...from,
		import.meta.url,
		process.cwd() + "/"
	] });
	const _resolve = (id) => {
		if (!id) return id;
		if (env.alias) id = resolveAlias(id, env.alias);
		if (id.startsWith("node:")) return id;
		if (builtinModules.includes(id)) return `node:${id}`;
		let resolved = resolveModulePath(id, { try: true });
		if (!resolved && id.startsWith("unenv/")) resolved = resolveModulePath(id.replace("unenv/", "unenv-nightly/"), { try: true });
		return resolved || id;
	};
	for (const alias in env.alias) env.alias[alias] = _resolve(env.alias[alias]);
	if (env.polyfill) for (let i = 0; i < env.polyfill.length; i++) env.polyfill[i] = _resolve(env.polyfill[i]);
	for (const global in env.inject) {
		const inject = env.inject[global];
		if (Array.isArray(inject)) {
			const [id, ...path] = inject;
			env.inject[global] = [_resolve(id), ...path];
		} else env.inject[global] = _resolve(inject);
	}
	return env;
}
function mergePresets(...presets) {
	const env = {
		alias: {},
		inject: {},
		polyfill: [],
		external: []
	};
	for (const preset of presets) {
		if (preset.alias) {
			const aliases = Object.keys(preset.alias).sort((a, b) => b.split("/").length - a.split("/").length || b.length - a.length);
			for (const from of aliases) env.alias[from] = preset.alias[from];
		}
		if (preset.inject) for (const [global, globalValue] of Object.entries(preset.inject)) if (Array.isArray(globalValue)) env.inject[global] = globalValue;
		else if (globalValue === false) delete env.inject[global];
		else env.inject[global] = globalValue;
		if (preset.polyfill) env.polyfill.push(...preset.polyfill.filter(Boolean));
		if (preset.external) env.external.push(...preset.external);
	}
	env.polyfill = resolveArray(env.polyfill);
	env.external = resolveArray(env.external);
	return env;
}
/**
* - Deduplicates items
* - Removes nagate items with ! prefix
*/
function resolveArray(arr) {
	const set = new Set(arr);
	for (const item of arr) if (item.startsWith("!")) {
		set.delete(item);
		set.delete(item.slice(1));
	}
	return [...set];
}

//#endregion
export { defineEnv };