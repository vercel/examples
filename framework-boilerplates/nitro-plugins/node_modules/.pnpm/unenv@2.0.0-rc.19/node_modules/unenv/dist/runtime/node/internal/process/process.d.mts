import { EventEmitter } from "node:events";
export declare class Process extends EventEmitter implements NodeJS.Process {
	#private;
	env: NodeJS.ProcessEnv;
	hrtime: NodeJS.Process["hrtime"];
	nextTick: NodeJS.Process["nextTick"];
	constructor(impl: {
		env: NodeJS.ProcessEnv;
		hrtime: NodeJS.Process["hrtime"];
		nextTick: NodeJS.Process["nextTick"];
	});
	// --- event emitter ---
	emitWarning(warning: unknown, type?: unknown, code?: unknown): void;
	emit(...args: any[]): any;
	listeners(eventName: string | symbol): any;
	get stdin();
	get stdout();
	get stderr();
	chdir(cwd: string): void;
	cwd(): string;
	// --- dummy props and getters ---
	arch: NodeJS.Architecture;
	platform: NodeJS.Platform;
	argv: string[];
	argv0: string;
	execArgv: string[];
	execPath: string;
	title: string;
	pid: number;
	ppid: number;
	get version(): string;
	get versions(): NodeJS.Process["versions"];
	get allowedNodeEnvironmentFlags();
	get sourceMapsEnabled(): boolean;
	get debugPort(): number;
	get throwDeprecation(): boolean;
	get traceDeprecation(): boolean;
	get features(): NodeJS.Process["features"];
	get release(): NodeJS.Process["release"];
	get connected(): boolean;
	get config(): NodeJS.Process["config"];
	get moduleLoadList(): unknown;
	constrainedMemory(): number;
	availableMemory(): number;
	uptime(): number;
	resourceUsage(): NodeJS.ResourceUsage;
	// --- noop methods ---
	ref();
	unref();
	// --- unimplemented methods ---
	umask(): number;
	getBuiltinModule(): any;
	getActiveResourcesInfo(): string[];
	exit(): never;
	reallyExit(): never;
	kill(): true;
	abort(): never;
	dlopen(): void;
	setSourceMapsEnabled(): void;
	loadEnvFile(): void;
	disconnect(): void;
	cpuUsage(): NodeJS.CpuUsage;
	setUncaughtExceptionCaptureCallback(): void;
	hasUncaughtExceptionCaptureCallback(): boolean;
	initgroups(): void;
	openStdin(): NodeJS.Socket;
	assert();
	binding();
	// --- attached interfaces ---
	permission: NodeJS.ProcessPermission;
	report: NodeJS.ProcessReport;
	finalization: NodeJS.Process["finalization"];
	memoryUsage;
	// --- undefined props ---
	mainModule?: NodeJS.Module | undefined;
	domain: undefined;
	// optional
	send: undefined;
	exitCode: undefined;
	channel: undefined;
	getegid: undefined;
	geteuid: undefined;
	getgid: undefined;
	getgroups: undefined;
	getuid: undefined;
	setegid: undefined;
	seteuid: undefined;
	setgid: undefined;
	setgroups: undefined;
	setuid: undefined;
	// internals
	_events: undefined;
	_eventsCount: undefined;
	_exiting: undefined;
	_maxListeners: undefined;
	_debugEnd: undefined;
	_debugProcess: undefined;
	_fatalException: undefined;
	_getActiveHandles: undefined;
	_getActiveRequests: undefined;
	_kill: undefined;
	_preload_modules: undefined;
	_rawDebug: undefined;
	_startProfilerIdleNotifier: undefined;
	_stopProfilerIdleNotifier: undefined;
	_tickCallback: undefined;
	_disconnect: undefined;
	_handleQueue: undefined;
	_pendingMessage: undefined;
	_channel: undefined;
	_send: undefined;
	_linkedBinding: undefined;
}
