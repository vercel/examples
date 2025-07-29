import { EventEmitter } from "node:events";
import { ReadStream, WriteStream } from "node:tty";
import { notImplemented, createNotImplementedError } from "../../../_internal/utils.mjs";
// node-version.ts is generated at build time
import { NODE_VERSION } from "./node-version.mjs";
export class Process extends EventEmitter {
	env;
	hrtime;
	nextTick;
	constructor(impl) {
		super();
		this.env = impl.env;
		this.hrtime = impl.hrtime;
		this.nextTick = impl.nextTick;
		for (const prop of [...Object.getOwnPropertyNames(Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
			const value = this[prop];
			if (typeof value === "function") {
				this[prop] = value.bind(this);
			}
		}
	}
	// --- event emitter ---
	emitWarning(warning, type, code) {
		console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
	}
	emit(...args) {
		// @ts-ignore
		return super.emit(...args);
	}
	listeners(eventName) {
		return super.listeners(eventName);
	}
	// --- stdio (lazy initializers) ---
	#stdin;
	#stdout;
	#stderr;
	get stdin() {
		return this.#stdin ??= new ReadStream(0);
	}
	get stdout() {
		return this.#stdout ??= new WriteStream(1);
	}
	get stderr() {
		return this.#stderr ??= new WriteStream(2);
	}
	// --- cwd ---
	#cwd = "/";
	chdir(cwd) {
		this.#cwd = cwd;
	}
	cwd() {
		return this.#cwd;
	}
	// --- dummy props and getters ---
	arch = "";
	platform = "";
	argv = [];
	argv0 = "";
	execArgv = [];
	execPath = "";
	title = "";
	pid = 200;
	ppid = 100;
	get version() {
		return `v${NODE_VERSION}`;
	}
	get versions() {
		return { node: NODE_VERSION };
	}
	get allowedNodeEnvironmentFlags() {
		return new Set();
	}
	get sourceMapsEnabled() {
		return false;
	}
	get debugPort() {
		return 0;
	}
	get throwDeprecation() {
		return false;
	}
	get traceDeprecation() {
		return false;
	}
	get features() {
		return {};
	}
	get release() {
		return {};
	}
	get connected() {
		return false;
	}
	get config() {
		return {};
	}
	get moduleLoadList() {
		return [];
	}
	constrainedMemory() {
		return 0;
	}
	availableMemory() {
		return 0;
	}
	uptime() {
		return 0;
	}
	resourceUsage() {
		return {};
	}
	// --- noop methods ---
	ref() {
		// noop
	}
	unref() {
		// noop
	}
	// --- unimplemented methods ---
	umask() {
		throw createNotImplementedError("process.umask");
	}
	getBuiltinModule() {
		return undefined;
	}
	getActiveResourcesInfo() {
		throw createNotImplementedError("process.getActiveResourcesInfo");
	}
	exit() {
		throw createNotImplementedError("process.exit");
	}
	reallyExit() {
		throw createNotImplementedError("process.reallyExit");
	}
	kill() {
		throw createNotImplementedError("process.kill");
	}
	abort() {
		throw createNotImplementedError("process.abort");
	}
	dlopen() {
		throw createNotImplementedError("process.dlopen");
	}
	setSourceMapsEnabled() {
		throw createNotImplementedError("process.setSourceMapsEnabled");
	}
	loadEnvFile() {
		throw createNotImplementedError("process.loadEnvFile");
	}
	disconnect() {
		throw createNotImplementedError("process.disconnect");
	}
	cpuUsage() {
		throw createNotImplementedError("process.cpuUsage");
	}
	setUncaughtExceptionCaptureCallback() {
		throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
	}
	hasUncaughtExceptionCaptureCallback() {
		throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
	}
	initgroups() {
		throw createNotImplementedError("process.initgroups");
	}
	openStdin() {
		throw createNotImplementedError("process.openStdin");
	}
	assert() {
		throw createNotImplementedError("process.assert");
	}
	binding() {
		throw createNotImplementedError("process.binding");
	}
	// --- attached interfaces ---
	permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
	report = {
		directory: "",
		filename: "",
		signal: "SIGUSR2",
		compact: false,
		reportOnFatalError: false,
		reportOnSignal: false,
		reportOnUncaughtException: false,
		getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
		writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
	};
	finalization = {
		register: /* @__PURE__ */ notImplemented("process.finalization.register"),
		unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
		registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
	};
	memoryUsage = Object.assign(() => ({
		arrayBuffers: 0,
		rss: 0,
		external: 0,
		heapTotal: 0,
		heapUsed: 0
	}), { rss: () => 0 });
	// --- undefined props ---
	mainModule = undefined;
	domain = undefined;
	// optional
	send = undefined;
	exitCode = undefined;
	channel = undefined;
	getegid = undefined;
	geteuid = undefined;
	getgid = undefined;
	getgroups = undefined;
	getuid = undefined;
	setegid = undefined;
	seteuid = undefined;
	setgid = undefined;
	setgroups = undefined;
	setuid = undefined;
	// internals
	_events = undefined;
	_eventsCount = undefined;
	_exiting = undefined;
	_maxListeners = undefined;
	_debugEnd = undefined;
	_debugProcess = undefined;
	_fatalException = undefined;
	_getActiveHandles = undefined;
	_getActiveRequests = undefined;
	_kill = undefined;
	_preload_modules = undefined;
	_rawDebug = undefined;
	_startProfilerIdleNotifier = undefined;
	_stopProfilerIdleNotifier = undefined;
	_tickCallback = undefined;
	_disconnect = undefined;
	_handleQueue = undefined;
	_pendingMessage = undefined;
	_channel = undefined;
	_send = undefined;
	_linkedBinding = undefined;
}
